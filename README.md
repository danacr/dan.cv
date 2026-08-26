# dan.cv

Static personal landing page for [www.dan.cv](https://www.dan.cv).

The site has no backend, framework, package manager, or build step. The page is contained in `index.html` and is deployed to GitHub Pages by `.github/workflows/build.yml` whenever a commit is pushed to `main`.

## Local preview

Install Git LFS and download the image assets before opening the site:

```sh
git lfs install
git lfs pull
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Files

- `index.html` — page markup, styling, and typing animation
- `img/` — favicon, navigation icon, and Cobalt banner
- `CNAME` — custom domain configuration
- `.gitattributes` — Git LFS rules for image assets
- `.github/workflows/build.yml` — GitHub Pages deployment

PNG, JPEG, GIF, and WebP images are tracked with Git LFS. The deployment workflow fetches their full contents before publishing the site.
