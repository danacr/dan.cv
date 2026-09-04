import { readFile, writeFile, mkdir, copyFile, access, rm } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import vm from "node:vm";

const sourceRoot = new URL("../twitter/", import.meta.url);
const outputRoot = new URL("../twitter-feed/", import.meta.url);
const source = await readFile(new URL("data/tweets.js", sourceRoot), "utf8");
const sandbox = { window: { YTD: { tweets: {} } } };
vm.runInNewContext(source, sandbox, { filename: "tweets.js" });

const sourceMedia = new URL("data/tweets_media/", sourceRoot);
const outputData = new URL("data/", outputRoot);
const outputMedia = new URL("data/media/", outputRoot);
const outputProfile = new URL("images/", outputRoot);
await rm(outputMedia, { recursive: true, force: true });
await Promise.all([
  mkdir(outputData, { recursive: true }),
  mkdir(outputMedia, { recursive: true }),
  mkdir(outputProfile, { recursive: true }),
]);

const posts = [];
for (const entry of sandbox.window.YTD.tweets.part0 || []) {
  const tweet = entry.tweet;
  if (!tweet?.id_str || !tweet?.created_at) continue;

  const retweetMatch = (tweet.full_text || "").match(/^RT @([^:]+):\s*/);
  if (retweetMatch || tweet.in_reply_to_status_id_str) continue;

  const mediaEntries = tweet.extended_entities?.media || tweet.entities?.media || [];
  const media = [];
  for (const item of mediaEntries) {
    const sourceName = basename((item.media_url_https || item.media_url || "").split("?")[0]);
    const stem = sourceName.slice(0, sourceName.length - extname(sourceName).length);
    if (!stem) continue;
    const isVideo = item.type === "video" || item.type === "animated_gif";
    const file = `${tweet.id_str}-${stem}.${isVideo ? "mp4" : "jpg"}`;
    const input = new URL(file, sourceMedia);
    try {
      await access(input);
      await copyFile(input, new URL(file, outputMedia));
      media.push({ file, type: isVideo ? "video" : "image" });
    } catch {
      // The post remains public even if an optional media file is unavailable.
    }
  }

  posts.push({
    id: tweet.id_str,
    createdAt: tweet.created_at,
    text: tweet.full_text || "",
    likeCount: Number(tweet.favorite_count || 0),
    repostCount: Number(tweet.retweet_count || 0),
    urls: (tweet.entities?.urls || []).map(({ url, expanded_url, display_url }) => ({
      short: url,
      expanded: expanded_url || display_url || url,
    })),
    mediaUrls: mediaEntries.map(item => item.url).filter(Boolean),
    media,
  });
}

posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
await writeFile(new URL("posts.js", outputData), `window.PUBLIC_TWITTER_POSTS=${JSON.stringify(posts)};\n`);

const publicProfileFiles = [
  "15162824-1671125807.jpg",
  "15162824-B5OtKepC.jpg",
];
for (const file of publicProfileFiles) {
  await copyFile(
    new URL(`data/profile_media/${file}`, sourceRoot),
    new URL(file, outputProfile),
  );
}

console.log(`Built public feed with ${posts.length} posts.`);
