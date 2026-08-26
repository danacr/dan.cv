# dan.cv

Static personal landing page for [www.dan.cv](https://www.dan.cv).

The site has no backend, framework, or package manager. The page is contained in `index.html` and is uploaded with `img/` to the web host over FTP by `.github/workflows/build.yml` whenever a commit is pushed to `main`.

Image assets and everything under `archive/` are stored with Git LFS. The deployment workflow downloads only `img/` and uploads only `index.html` and `img/`; archived files are never sent to the FTP server. The archive menu streams videos from Git LFS, renders archived HTML client-side, and opens the PDF through Google Docs Viewer.
