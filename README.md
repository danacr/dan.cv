# dan.cv

Static personal landing page for [www.dan.cv](https://www.dan.cv), including a read-only archive of public Twitter posts.

The site has no backend, framework, or package manager. The page is contained in `index.html` and is published with its manifest and the public `img/` and processed `twitter-feed/` folders by `.github/workflows/build.yml` whenever a commit is pushed to `main`. The workflow resolves deployed Git LFS assets, builds a clean `public-site/` payload, and mirrors it to `/web/` over FTP. Files no longer present in that payload are removed from the server.

Image assets and everything under `archive/` are stored with Git LFS. The deployment workflow downloads the site images and public tweet media, then uploads the landing page and its public assets; archived files are never sent to the FTP server. The archive menu streams videos from Git LFS, renders archived HTML client-side, and opens the PDF through Google Docs Viewer.

The original `twitter/` export remains untouched, local, and fully ignored. `scripts/build-twitter-feed.mjs` reads only its public Tweets and public profile media to produce the separate `twitter-feed/` directory. Replies and Retweets are filtered out, and the processed feed contains only the fields needed to render original public posts. Direct messages, message attachments, contacts, account history, IP data, advertising data, and the original archive application are never copied or deployed.
