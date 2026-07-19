# Graph Report - rizky-project-web  (2026-07-19)

## Corpus Check
- 79 files · ~27,828 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 459 nodes · 619 edges · 29 communities (28 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `58e2d60f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- KisahCinta.vue
- CoverSection.vue
- Acara.vue
- GaleriFoto.vue
- Rsvp.vue
- assetUrl
- Cover.vue
- rizky-project-web
- MusicPlayer.vue
- Membuat Tema Baru
- CLAUDE.md
- README.md

## God Nodes (most connected - your core abstractions)
1. `assetUrl()` - 19 edges
2. `api` - 16 edges
3. `uploadThemeFile()` - 6 edges
4. `useGuestShare()` - 5 edges
5. `useAuthStore` - 5 edges
6. `rizky-project-web` - 5 edges
7. `scripts` - 4 edges
8. `viewUrl()` - 4 edges
9. `useGifts()` - 4 edges
10. `useMyInvitations()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `useGuestShare()` --indirect_call--> `copy()`  [INFERRED]
  src/modules/dashboard/composables/useGuestShare.js → src/modules/invitation/themes/_core/sections/GiftSection.vue
- `onBgFile()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/components/SectionDisplayFields.vue → src/modules/invitation/composables/useThemeUpload.js
- `handleUpload()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/pages/EditUndangan.vue → src/modules/invitation/composables/useThemeUpload.js
- `handleSlideshowUpload()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/pages/EditUndangan.vue → src/modules/invitation/composables/useThemeUpload.js
- `screenStyle()` --calls--> `assetUrl()`  [EXTRACTED]
  src/modules/invitation/themes/mildness/Layout.vue → src/modules/invitation/composables/assets.js

## Import Cycles
- None detected.

## Communities (29 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (32): CORE, entries, props, useGuestbook(), useRsvp(), hexToRgba(), toEmbedUrl(), toMapsEmbed() (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (12): cardOf(), ctx, dateLong, firstEvent, opened, props, quote, reveal (+4 more)

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (14): dateLong, layout, now, parts, props, quoteText, style, timer (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (21): app, auth, MENU, router, sidebarOpen, theme, auth, busy (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (14): isOpen, usePortfolio(), usePortfolioDocumentation(), closeLightbox(), { experiences, loading, error, fetchDocumentation }, handleKeydown(), { lang, toggleLang, t }, lightboxUrl (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (16): usePublicInvitation(), { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, countdown, animation, sectionCard, sectionFontVars, hero }, { data, isLoading, isError }, features, invitation, PRELOADED, route, slug (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (13): PRESETS, vReveal, activeCorners, cardOf(), ctx, heroCardStyle, heroSlides, heroUseCard (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (31): autoprefixer, axios, gsap, dependencies, axios, gsap, pinia, @tanstack/vue-query (+23 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (30): { data, isLoading, isError }, CARD_STYLES, onBgFile(), props, uploading, blankForm(), blankSection(), BODY_FONTS (+22 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (34): { invitation, isLoading, isError, error }, STATUS_LABEL, useGuestShare(), viewUrl(), auth, { copy, copied }, { data, isLoading, isError, error }, shareHref() (+26 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (17): closeLightbox(), currentPhoto, floatingIndex, floatingPageIdx, floatingPagesRaw, floatingThumbs, gridPage, gridPageCount (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.24
Nodes (8): closeLightbox(), currentStory, lightboxIndex, lightboxNext(), lightboxPrev(), onKeydown(), photoStories, props

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (14): editingId, EMPTY, err, form, gate, invitationId, { list, create, update, remove }, qrisFile (+6 more)

### Community 17 - "KisahCinta.vue"
Cohesion: 0.15
Nodes (13): editingId, EMPTY, err, form, gate, invitationId, { list, create, update, remove }, photoFile (+5 more)

### Community 18 - "CoverSection.vue"
Cohesion: 0.14
Nodes (9): emit, ornament, photo, props, initials, props, ctx, opened (+1 more)

### Community 19 - "Acara.vue"
Cohesion: 0.18
Nodes (11): editingId, EMPTY, err, form, gate, invitationId, { list, create, update, remove }, resetForm() (+3 more)

### Community 20 - "GaleriFoto.vue"
Cohesion: 0.16
Nodes (8): caption, err, file, gate, invitationId, { list, upload, updateCaption, remove, reorder }, base(), useGalleryPhotos()

### Community 21 - "Rsvp.vue"
Cohesion: 0.28
Nodes (6): ATTENDANCE_LABEL, gate, invitationId, { list }, rsvpExportUrl(), useRsvpList()

### Community 22 - "assetUrl"
Cohesion: 0.36
Nodes (4): active, list, props, assetUrl()

### Community 23 - "Cover.vue"
Cohesion: 0.29
Nodes (6): coverCd, dateLong, emit, firstEvent, heroSlides, props

### Community 24 - "rizky-project-web"
Cohesion: 0.33
Nodes (5): Deploy, Menjalankan (dev), Peta domain (produksi, semua di VPS), rizky-project-web, Struktur — satu modul, satu folder

### Community 25 - "MusicPlayer.vue"
Cohesion: 0.40
Nodes (3): audio, playing, props

### Community 26 - "Membuat Tema Baru"
Cohesion: 0.40
Nodes (4): Checklist sebelum rilis tema, Langkah, Membedakan satu section saja, Membuat Tema Baru

### Community 27 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Conventions, Project, Structure

## Knowledge Gaps
- **238 isolated node(s):** `name`, `private`, `type`, `dev`, `build` (+233 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `assetUrl()` connect `assetUrl` to `Community 0`, `Community 1`, `Community 2`, `Community 6`, `Community 10`, `Community 11`, `Community 12`, `KisahCinta.vue`, `CoverSection.vue`, `GaleriFoto.vue`, `Cover.vue`, `MusicPlayer.vue`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **Why does `api` connect `Community 8` to `Community 3`, `Community 9`, `Community 12`, `KisahCinta.vue`, `Acara.vue`, `GaleriFoto.vue`, `Rsvp.vue`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `useAuthStore` connect `Community 3` to `Community 9`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _238 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05230496453900709 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._