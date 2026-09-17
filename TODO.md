# NEAR Lab site (AI-DA-STC/nearlab) — handoff TODO

Picked up from a working session. Branch carrying the current work: **`port-bios-and-branding`** —
pushed to `origin`. Deploy is the GitHub Actions workflow on `main`, so none of this is live until a
merge/release to `main`.

## DONE (committed on `port-bios-and-branding`)
- Ported the four member bios (William, Krishna, Roy, Jiaying) from the retired
  `near-lab.github.io` Jekyll site into `Person.bio` (`src/pages/people/model/person.ts`,
  rendered in `PersonCard`).
- Footer: expansion text → "Next-gen Edge AI and Robotics Lab."; address →
  "Seletar Digital Hub, 600 West Camp Road, Singapore"; `<title>` synced.
- Hero video: **re-encoded 50MB/8Mbps → 6.7MB 720p H.264 (CRF27, no audio, faststart) and
  removed it from Git LFS** (`.gitattributes` now `-filter`, stored as a regular ~7MB blob).
  The deployed artifact previously shipped a 133-byte LFS pointer (video never played).
- Footer social links: dropped the dead `#` LinkedIn/YouTube, kept GitHub
  (https://github.com/AI-DA-STC) + Email.
- Logo: replaced the hand-drawn SVG mascot with the real `near_lab.png` from the Jekyll repo
  (`public/uploads/logo/near_lab.png`); footer keeps an inverted (white) treatment. Added
  `public/favicon.png` — note: favicon is NOT yet linked in `index.html`.

## OPEN — RL²-VLA video (the last thing being worked on)
The on-site "video" is `public/uploads/papers/rl2-vla.gif` — 326×184px → this is the pixelation.
Replace with a crisp MP4 loop cut from the YouTube source:
`https://www.youtube.com/watch?v=0qdPVgib6vI` (the `video` resource in `paper.ts`).

Source downloaded (1080p/30fps, 5:31) to:
`/var/folders/hv/k93_9h2n33d_mvng8dqsfdlr0000gn/T/opencode/rl2vla.mp4` (this temp dir may be
cleaned up — re-download with `yt-dlp -f "137+140" -o rl2vla.mp4 <url>` if needed).

Motion analysis: the video is mostly static shots with short action bursts around **~265s**,
**~302s**, and **~315s**. A segment decision is required (I could not inspect frames in-session).
Once a start time `T` and length are chosen (e.g. T=313, L=10):
```bash
ffmpeg -y -ss T -t L -i rl2vla.mp4 -an -c:v libx264 -crf 23 -preset slow \
  -movflags +faststart -pix_fmt yuv420p public/uploads/papers/rl2-vla.mp4
ffmpeg -y -ss T -i rl2vla.mp4 -frames:v 1 -q:v 3 public/uploads/papers/rl2-vla-poster.jpg
git rm public/uploads/papers/rl2-vla.gif   # remove the pixelated gif once replaced
```
Then wire it (MediaPlaceholder already renders `.mp4` as a muted looping clip):
- `src/entities/paper/model/paper.ts`: `image: '/uploads/papers/rl2-vla.mp4'`,
  `poster: '/uploads/papers/rl2-vla-poster.jpg'` (featured carousel + activity feed pick this up
  automatically via `RL2_VLA`).
- Optional: bump `figure` caption to match the new shot.
Verify with `npm run typecheck && npm run lint:fsd && npm run build`.

## OPEN — content / links
- **William Teo links** (`person.ts` LAB_LEAD): add `scholar`
  `https://scholar.google.com/citations?user=kgn0kGkAAAAJ&hl=en` and `website`
  `https://www.william-teo.com` (both from the Jekyll site). Verify LinkedIn handle:
  React uses `in/willteo/`, Jekyll used `in/william-teo/` — LinkedIn blocks bots (HTTP 999),
  so confirm which page is real.
- **News rail is empty** (`src/pages/home/model/news.ts`) — backfill the three dated Jekyll
  entries: Singapore Airshow 2026, DSSG talk (Google Developers Space), InnoTech 2025. The
  `LatestRail` "All updates →" and any item links are currently `href="#"` — give them real
  destinations while you're there.
- **DSSG activity item missing** — add to `src/pages/home/model/activity.ts` (media/posts):
  DSSG talk, event link `https://luma.com/thdjuruz`, LinkedIn update
  `https://www.linkedin.com/feed/update/urn:li:activity:7420330486691987457/`.
- **Blogs are empty**: all four markdown bodies under `public/uploads/blogs/*/…md` are
  front-matter only, yet cards advertise "9–14 min read". Either write the posts or drop the
  reading-time claims until there is content.
- **Address/venue drift**: Jekyll said "Seletar Digital Hub" (now fixed here); confirm any other
  lab materials still say the old anything.

## OPEN — SEO / PWA-ish chrome (near-Jekyll parity)
- Per-route `document.title`/meta description/OG tags (single fixed title in `index.html` today);
  hash router means URLs are `/#/papers` etc. — add a sitemap listing the root, or move off the
  hash router if clean URLs matter.
- Link the favicon in `index.html` (`<link rel="icon" href="/favicon.png" />`) — file is added,
  link is not.
- Add `public/robots.txt` and `public/sitemap.xml`.
- `paper.ts` arXiv resource is `http://arxiv.org/...` — make it `https`.

## OPEN — hygiene
- `tsconfig.tsbuildinfo` is committed — add to `.gitignore` and `git rm --cached` it.
- `deploy.yml` has no quality gate: add `npm run typecheck` + `npm run lint:fsd` before build.
- Heavy images: `public/uploads/themes/security.png` (~5.9MB), `media/airshow.png` (~2.6MB),
  some blog/GIF thumbs (~1.8–2.5MB). Re-encode/compress.
- `dist` is ~74MB largely due to the hero video — acceptable once the video is verified live;
  consider `loading="lazy"`/preload tuning later.

## Verify before shipping (post-merge plan)
1. Deploy from `main`, then confirm `https://nearlab.ai/uploads/home/hero-video.mp4` serves video
   (not the old 133B pointer) and the hero actually plays.
2. Eye-check `/people` (bios render), `/` footer, logo in header/footer, favicon.
