# CLAUDE.md: NEAR Lab website

Rules for any Claude session working in this repository. Read before editing.

## The one rule: development first, the person merges

1. Work only on the `development` branch. Never commit on `main`, never push to `main`.
2. Push to `development`. About two minutes later the change is on the test site,
   https://nearlab.ai/preview/ (hidden from search engines).
3. Then tell the user, in these words or close to them:
   > Check it on https://nearlab.ai/preview/ (Ctrl+Shift+R to reload).
   > When it looks right, open https://github.com/AI-DA-STC/nearlab/compare/main...development,
   > click **Create pull request**, wait for the green tick, then **Merge pull request** →
   > **Confirm merge**. Do not click **Delete branch**. The live site, https://nearlab.ai/,
   > updates about two minutes later.
   If a pull request from `development` is already open, give its link instead (new pushes join it).
4. Claude never merges a pull request, even when asked. The merge button on the GitHub web page is
   the person's step.

`scripts/claude/guard.mjs` enforces this for Claude: `.claude/settings.json` runs it before every
shell command and it blocks pushes to `main`, `gh pr merge`, force pushes and branch deletion.
People can still commit to `main` directly; this rule is for Claude.

Use the `nearlab-change` skill for every edit.

## How the site is built

- Vite + React + TypeScript, organised with Feature-Sliced Design (see `README.md`). Hash router:
  pages are `/#/papers`, `/#/news/<slug>`.
- Content lives in TypeScript data files, not a CMS:
  - news: `src/entities/news-item/model/news.ts`, photos in `public/uploads/news/<folder>/`
  - papers: `src/entities/paper/model/paper.ts`
  - blog posts: `src/entities/blog/model/blog.ts` + `public/uploads/blogs/<slug>/<slug>.md`
  - home spotlight: `src/pages/home/model/featured.ts`; home feed: `src/pages/home/model/activity.ts`
  - people: `src/pages/people/model/person.ts`
- `.github/workflows/ci.yml` checks every push to `development` and every pull request;
  `deploy.yml` publishes `main` at `/` and `development` at `/preview/` together.

## Checks before every push

```bash
export PATH=~/.local/bin:$PATH   # if node is not on the PATH
npm ci                           # once
npm run typecheck && npm run lint:fsd && npm run build
```

## Gotchas

- Write file paths as `/uploads/...` in code and in blog markdown. `vite/previewBase.ts` rewrites
  them for the `/preview/` copy; any other form breaks the preview.
- Every file is published twice (live + preview). Prefer `.webp` for photos, keep videos at 720p,
  and never commit originals the site does not show.
- After a deploy, the browser or GitHub's cache can show the old page for up to 10 minutes.
  Reload with Ctrl+Shift+R; never revert for this.
- William Teo is the Director of NEAR Lab (never "Lead") and approves what goes live.
