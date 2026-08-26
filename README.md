# NEAR Lab site

The `NEAR Lab Site.dc.html` design canvas, built as a Vite + React + TypeScript
app organised with [Feature-Sliced Design v2.1](https://fsd.how).

```bash
npm install
npm run dev        # dev server
npm run build      # typecheck + production build
npm run typecheck
npm run lint:fsd   # Steiger, the official FSD linter
```

## Layer map

The source was one 986-line file mixing a template DSL, inline styles and a
data blob. It is now split by **layer**, then by **slice**, then by **segment**:

```
src/
  app/                     App-wide setup — the only layer that composes freely
    index.tsx                entry point
    router.tsx               hash router (preserves the design's #papers links)
    layout/                  SiteHeader · SiteFooter · MobileNavOverlay · SiteLayout
    styles/                  tokens.css · reset.css · global.css

  pages/                   One slice per route; each owns its own logic
    home/    ui/ HeroSection · FeaturedCarousel · ActivityFeed · LatestRail
             model/ featured.ts · activity.ts · news.ts
    themes/  ui/ ThemesPage
    papers/  ui/ PapersPage · PaperCard
    blogs/   ui/ BlogsPage · BlogCard
    people/  ui/ PeoplePage · PersonCard · PersonLinks · profile-icons
             model/ person.ts
    join/    ui/ JoinPage · RouteCard · PartnerTicker · OpenPositions
             model/ collaboration.ts

  features/                User interactions confirmed in 2+ places
    publication-filter/      theme + year filtering, shared by papers and blogs

  entities/                Domain models consumed by 2+ slices
    theme/                   the 8-theme taxonomy + short labels
    paper/                   papers dataset
    blog/                    blogs dataset

  shared/                  Infrastructure, no business logic
    ui/                      Container · PageSection · headings · Badge · ChipRow
                             FilterPill · LoadMoreButton · MediaPlaceholder
                             LogoMark · ArrowGlyph · Eyebrow
    config/                  route paths, nav items, contact address
    lib/                     cx()
```

