# Graph Report - rizky-project-web  (2026-07-21)

## Corpus Check
- 98 files · ~31,914 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 479 nodes · 674 edges · 27 communities (26 shown, 1 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a1c205fe`
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
- rizky-project-web
- Membuat Tema Baru
- CLAUDE.md
- README.md

## God Nodes (most connected - your core abstractions)
1. `assetUrl()` - 20 edges
2. `api` - 14 edges
3. `useCrudResource()` - 10 edges
4. `uploadThemeFile()` - 6 edges
5. `useGuestShare()` - 5 edges
6. `useMyInvitations()` - 5 edges
7. `useAuthStore` - 5 edges
8. `rizky-project-web` - 5 edges
9. `Membuat Tema Baru` - 5 edges
10. `scripts` - 4 edges

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

## Communities (27 total, 1 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (33): CORE, entries, props, useGuestbook(), useRsvp(), hexToRgba(), toEmbedUrl(), toMapsEmbed() (+25 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (11): coverCd, dateDots, ELEMENT_DEFAULTS, emit, firstEvent, heroPhoto, heroStyle, KNOWN_HERO_STYLES (+3 more)

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (8): dateLong, layout, now, parts, props, quoteText, style, timer

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (20): app, auth, MENU, router, sidebarOpen, theme, auth, busy (+12 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (14): isOpen, usePortfolio(), usePortfolioDocumentation(), closeLightbox(), { experiences, loading, error, fetchDocumentation }, handleKeydown(), { lang, toggleLang, t }, lightboxUrl (+6 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (16): usePublicInvitation(), { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, sectionHeight, countdown, animation, sectionCard, sectionFontVars, hero }, { data, isLoading, isError }, features, invitation, PRELOADED, route, slug (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.16
Nodes (12): cardOf(), ctx, dateLong, firstEvent, opened, props, quote, reveal (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (31): autoprefixer, axios, gsap, dependencies, axios, gsap, pinia, @tanstack/vue-query (+23 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (26): props, HERO_ELEMENTS, CARD_STYLES, onBgFile(), props, uploading, SECTIONS, BODY_FONTS (+18 more)

### Community 9 - "Community 9"
Cohesion: 0.05
Nodes (41): { data, isLoading, isError }, { invitation, isLoading, isError, error }, STATUS_LABEL, useGuestShare(), viewUrl(), auth, { copy, copied }, { data, isLoading, isError, error } (+33 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (17): closeLightbox(), currentPhoto, floatingIndex, floatingPageIdx, floatingPagesRaw, floatingThumbs, gridPage, gridPageCount (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (10): PRESETS, vReveal, closeLightbox(), currentStory, lightboxIndex, lightboxNext(), lightboxPrev(), onKeydown() (+2 more)

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (11): activeCorners, cardOf(), ctx, heroCardStyle, heroSlides, heroUseCard, opened, props (+3 more)

### Community 17 - "KisahCinta.vue"
Cohesion: 0.18
Nodes (9): active, list, props, coverCd, dateLong, emit, firstEvent, heroSlides (+1 more)

### Community 18 - "CoverSection.vue"
Cohesion: 0.29
Nodes (5): assetUrl(), emit, ornament, photo, props

### Community 19 - "Acara.vue"
Cohesion: 0.22
Nodes (5): initials, props, ctx, opened, props

### Community 20 - "GaleriFoto.vue"
Cohesion: 0.06
Nodes (37): useEditableForm(), { editingId, form, err, startEdit, resetForm, submit }, EMPTY, gate, invitationId, { list, create, update, remove }, caption, err (+29 more)

### Community 21 - "Rsvp.vue"
Cohesion: 0.28
Nodes (6): ATTENDANCE_LABEL, gate, invitationId, { list }, rsvpExportUrl(), useRsvpList()

### Community 22 - "assetUrl"
Cohesion: 0.40
Nodes (3): audio, playing, props

### Community 24 - "rizky-project-web"
Cohesion: 0.33
Nodes (5): Deploy, Menjalankan (dev), Peta domain (produksi, semua di VPS), rizky-project-web, Struktur — satu modul, satu folder

### Community 26 - "Membuat Tema Baru"
Cohesion: 0.33
Nodes (5): Checklist sebelum rilis tema, Langkah, Membedakan satu section saja, Membuat Tema Baru, Menambah varian gaya pada section (contoh: hero.style baru)

### Community 27 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Conventions, Project, Structure

## Knowledge Gaps
- **239 isolated node(s):** `name`, `private`, `type`, `dev`, `build` (+234 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `assetUrl()` connect `CoverSection.vue` to `Community 0`, `Community 1`, `Community 2`, `Community 6`, `Community 10`, `Community 11`, `Community 12`, `KisahCinta.vue`, `GaleriFoto.vue`, `assetUrl`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `api` connect `Community 9` to `Community 8`, `GaleriFoto.vue`, `Rsvp.vue`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `useActiveInvitation()` connect `Community 9` to `Community 8`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _239 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05102040816326531 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07816091954022988 - nodes in this community are weakly interconnected._