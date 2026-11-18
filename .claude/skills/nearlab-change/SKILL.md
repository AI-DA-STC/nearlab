---
name: nearlab-change
description: Use for any change to the NEAR Lab website (nearlab.ai) - content, photos, videos, a page, a style or the code. Edits go to the development branch and the test site; the user merges the pull request on GitHub.
---

# Change the NEAR Lab website

## 1. Start on development, up to date
```bash
git fetch origin
git switch development
git merge --ff-only origin/development
git merge origin/main          # main also takes direct commits; bring them in
```
If `git switch development` fails because of local changes, stop and ask the user.

## 2. Say what you will change
One or two sentences to the user before editing: which page, which file, what it will say.

## 3. Edit
Content files are listed in `CLAUDE.md`. Keep paths as `/uploads/...`. Photos as `.webp`,
videos at 720p.

## 4. Check
```bash
npm run typecheck && npm run lint:fsd && npm run build && rm -rf dist
```
All three must pass. For a visible change, look at it: build with
`BASE_PATH=/preview/ npx vite build --outDir <scratch>/preview`, serve the scratch folder
(not port 8765) and take a screenshot.

## 5. Commit and push to development
```bash
git add <the files you changed>      # by path, never `git add -A`
git commit -m "<what changed, in plain words>"
git push origin development
```
If the user pushes with GitHub Desktop instead, stop after the commit and tell them to push.

## 6. Hand over
Wait for the CI run (`gh run list --branch development --limit 1`), then tell the user:
- what changed, and the preview link to the page: `https://nearlab.ai/preview/#/...`
- to reload with Ctrl+Shift+R
- to merge on GitHub when happy: open
  https://github.com/AI-DA-STC/nearlab/compare/main...development (or the open pull request:
  `gh pr list --base main --head development`), **Create pull request**, wait for the green
  tick, **Merge pull request** → **Confirm merge**, and not **Delete branch**.

Opening the pull request for the user (`gh pr create --base main --head development`) is fine.
Merging it is not: never run `gh pr merge` and never push to `main`. The guard hook blocks both.
