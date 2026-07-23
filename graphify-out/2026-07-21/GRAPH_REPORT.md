# Graph Report - rizky-project-web  (2026-07-21)

## Corpus Check
- 106 files · ~36,499 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 573 nodes · 788 edges · 30 communities (28 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9939a9b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
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
- client.js
- GaleriFoto.vue
- Rsvp.vue
- CasesList.vue
- useInvitation.js
- rizky-project-web
- CountdownSection.vue
- Membuat Tema Baru
- CLAUDE.md
- README.md
- _template/Layout.vue
- useReveal.js

## God Nodes (most connected - your core abstractions)
1. `assetUrl()` - 20 edges
2. `api` - 18 edges
3. `useCrudResource()` - 10 edges
4. `uploadThemeFile()` - 6 edges
5. `useGuestShare()` - 5 edges
6. `useMyInvitations()` - 5 edges
7. `load()` - 5 edges
8. `useSkripsiAuthStore` - 5 edges
9. `useAuthStore` - 5 edges
10. `rizky-project-web` - 5 edges

## Surprising Connections (you probably didn't know these)
- `useGuestShare()` --indirect_call--> `copy()`  [INFERRED]
  src/modules/dashboard/composables/useGuestShare.js → src/modules/invitation/themes/_core/sections/GiftSection.vue
- `useMyInvitations()` --indirect_call--> `base()`  [INFERRED]
  src/modules/invitation/composables/useInvitation.js → src/modules/invitation/composables/useGuestbookAdmin.js
- `onBgFile()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/components/SectionDisplayFields.vue → src/modules/invitation/composables/useThemeUpload.js
- `handleUpload()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/pages/EditUndangan.vue → src/modules/invitation/composables/useThemeUpload.js
- `handleSlideshowUpload()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/pages/EditUndangan.vue → src/modules/invitation/composables/useThemeUpload.js

## Import Cycles
- None detected.

## Communities (30 total, 2 thin omitted)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (11): coverCd, dateDots, ELEMENT_DEFAULTS, emit, firstEvent, heroPhoto, heroStyle, KNOWN_HERO_STYLES (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.29
Nodes (5): assetUrl(), emit, ornament, photo, props

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (20): app, auth, MENU, router, sidebarOpen, theme, auth, busy (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (23): addAlternative(), addCriterion(), alternativeLabel, alternatives, busy, calculatedAt, canCalculate, criteria (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (15): { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, sectionHeight, countdown, animation, sectionCard, sectionFontVars, hero }, { data, isLoading, isError }, features, invitation, PRELOADED, route, slug, theme (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (14): cardOf(), ctx, dateLong, firstEvent, leftBgStyle, opened, props, quote (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (31): autoprefixer, axios, gsap, dependencies, axios, gsap, pinia, @tanstack/vue-query (+23 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (25): props, HERO_ELEMENTS, CARD_STYLES, onBgFile(), props, uploading, SECTIONS, BODY_FONTS (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (31): STATUS_LABEL, useGuestShare(), viewUrl(), auth, { copy, copied }, { data, isLoading, isError, error }, shareHref(), shareText() (+23 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (17): closeLightbox(), currentPhoto, floatingIndex, floatingPageIdx, floatingPagesRaw, floatingThumbs, gridPage, gridPageCount (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.24
Nodes (8): closeLightbox(), currentStory, lightboxIndex, lightboxNext(), lightboxPrev(), onKeydown(), photoStories, props

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (14): PRESETS, setRevealScroller(), vReveal, activeCorners, cardOf(), ctx, heroCardStyle, heroSlides (+6 more)

### Community 17 - "KisahCinta.vue"
Cohesion: 0.05
Nodes (27): isOpen, isSticky, usePortfolio(), usePortfolioDocumentation(), closeLightbox(), { experiences, loading, error, fetchDocumentation }, handleKeydown(), { lang, toggleLang, t } (+19 more)

### Community 18 - "CoverSection.vue"
Cohesion: 0.17
Nodes (9): active, list, props, coverCd, dateLong, emit, firstEvent, heroSlides (+1 more)

### Community 19 - "client.js"
Cohesion: 0.05
Nodes (36): { data, isLoading, isError }, gate, invitationId, { list, setApproved, remove }, base(), useGuestbookAdmin(), useThemes(), cases (+28 more)

### Community 20 - "GaleriFoto.vue"
Cohesion: 0.05
Nodes (38): { invitation, isLoading, isError, error }, useEditableForm(), { editingId, form, err, startEdit, resetForm, submit }, EMPTY, gate, invitationId, { list, create, update, remove }, caption (+30 more)

### Community 21 - "Rsvp.vue"
Cohesion: 0.28
Nodes (6): ATTENDANCE_LABEL, gate, invitationId, { list }, rsvpExportUrl(), useRsvpList()

### Community 23 - "useInvitation.js"
Cohesion: 0.05
Nodes (35): CORE, entries, props, useActiveInvitation(), useGuestbook(), useMyInvitations(), usePublicInvitation(), useRsvp() (+27 more)

### Community 24 - "rizky-project-web"
Cohesion: 0.33
Nodes (5): Deploy, Menjalankan (dev), Peta domain (produksi, semua di VPS), rizky-project-web, Struktur — satu modul, satu folder

### Community 25 - "CountdownSection.vue"
Cohesion: 0.22
Nodes (8): dateLong, layout, now, parts, props, quoteText, style, timer

### Community 26 - "Membuat Tema Baru"
Cohesion: 0.33
Nodes (5): Checklist sebelum rilis tema, Langkah, Membedakan satu section saja, Membuat Tema Baru, Menambah varian gaya pada section (contoh: hero.style baru)

### Community 27 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Conventions, Project, Structure

### Community 29 - "_template/Layout.vue"
Cohesion: 0.22
Nodes (5): initials, props, ctx, opened, props

### Community 35 - "useReveal.js"
Cohesion: 0.40
Nodes (3): audio, playing, props

## Knowledge Gaps
- **294 isolated node(s):** `name`, `private`, `type`, `dev`, `build` (+289 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api` connect `client.js` to `Community 4`, `Community 8`, `Community 9`, `GaleriFoto.vue`, `Rsvp.vue`, `useInvitation.js`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `assetUrl()` connect `Community 2` to `Community 1`, `useReveal.js`, `Community 6`, `Community 10`, `Community 11`, `Community 12`, `CoverSection.vue`, `GaleriFoto.vue`, `useInvitation.js`, `CountdownSection.vue`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `useActiveInvitation()` connect `useInvitation.js` to `Community 8`, `GaleriFoto.vue`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _294 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07816091954022988 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.07586206896551724 - nodes in this community are weakly interconnected._