# Graph Report - rizky-project-web  (2026-07-21)

## Corpus Check
- 98 files · ~31,914 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 479 nodes · 599 edges · 36 communities (33 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1c70ccb3`
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
- Community 14
- KisahCinta.vue
- CoverSection.vue
- Acara.vue
- GaleriFoto.vue
- Rsvp.vue
- assetUrl
- Beranda.vue
- rizky-project-web
- UndanganSaya.vue
- Membuat Tema Baru
- CLAUDE.md
- README.md
- client.js
- SectionWrapper.vue
- registry.js
- UcapanDoa.vue
- useInvitation.js
- CoupleSection.vue
- useReveal.js

## God Nodes (most connected - your core abstractions)
1. `api` - 11 edges
2. `useCrudResource()` - 10 edges
3. `assetUrl()` - 10 edges
4. `_template/Layout.vue` - 8 edges
5. `Membuat Tema Baru` - 5 edges
6. `useGuestShare()` - 5 edges
7. `useMyInvitations()` - 5 edges
8. `rizky-project-web` - 5 edges
9. `useEditableForm()` - 4 edges
10. `useEvents()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `useGuestShare()` --indirect_call--> `copy()`  [INFERRED]
  src/modules/dashboard/composables/useGuestShare.js → src/modules/invitation/themes/_core/sections/GiftSection.vue
- `useMyInvitations()` --indirect_call--> `base()`  [INFERRED]
  src/modules/invitation/composables/useInvitation.js → src/modules/invitation/composables/useGuestbookAdmin.js
- `useEvents()` --calls--> `useCrudResource()`  [EXTRACTED]
  src/modules/invitation/composables/useEvents.js → src/shared/composables/useCrudResource.js
- `useGalleryPhotos()` --calls--> `useCrudResource()`  [EXTRACTED]
  src/modules/invitation/composables/useGalleryPhotos.js → src/shared/composables/useCrudResource.js
- `useGifts()` --calls--> `useCrudResource()`  [EXTRACTED]
  src/modules/invitation/composables/useGifts.js → src/shared/composables/useCrudResource.js

## Import Cycles
- None detected.

## Communities (36 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (11): useGuestbook(), useRsvp(), error, form, gb, props, done, error (+3 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (22): activeCorners, cardOf(), ctx, heroCardStyle, heroSlides, heroUseCard, opened, props (+14 more)

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
Nodes (18): hexToRgba(), toEmbedUrl(), toMapsEmbed(), useThemeOptions(), { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, sectionHeight, countdown, animation, sectionCard, sectionFontVars, hero }, { data, isLoading, isError }, features, invitation (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (18): cardOf(), ctx, dateLong, firstEvent, opened, props, quote, reveal (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (31): autoprefixer, axios, gsap, dependencies, axios, gsap, pinia, @tanstack/vue-query (+23 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (21): props, HERO_ELEMENTS, CARD_STYLES, props, uploading, SECTIONS, BODY_FONTS, CARD_STYLES (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (12): busy, err, form, gate, { guestLink, waMessage, waHref, copy, copied }, guestsQuery, importFile, importing (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (17): closeLightbox(), currentPhoto, floatingIndex, floatingPageIdx, floatingPagesRaw, floatingThumbs, gridPage, gridPageCount (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (11): CORE, entries, props, closeLightbox(), currentStory, lightboxIndex, lightboxNext(), lightboxPrev() (+3 more)

### Community 17 - "KisahCinta.vue"
Cohesion: 0.36
Nodes (4): active, list, props, assetUrl()

### Community 18 - "CoverSection.vue"
Cohesion: 0.33
Nodes (4): emit, ornament, photo, props

### Community 19 - "Acara.vue"
Cohesion: 0.22
Nodes (6): initials, props, _template/Layout.vue, ctx, opened, props

### Community 20 - "GaleriFoto.vue"
Cohesion: 0.06
Nodes (37): useEditableForm(), { editingId, form, err, startEdit, resetForm, submit }, EMPTY, gate, invitationId, { list, create, update, remove }, caption, err (+29 more)

### Community 21 - "Rsvp.vue"
Cohesion: 0.28
Nodes (6): ATTENDANCE_LABEL, gate, invitationId, { list }, rsvpExportUrl(), useRsvpList()

### Community 22 - "assetUrl"
Cohesion: 0.40
Nodes (3): audio, playing, props

### Community 23 - "Beranda.vue"
Cohesion: 0.24
Nodes (9): STATUS_LABEL, useGuestShare(), viewUrl(), auth, { copy, copied }, { data, isLoading, isError, error }, shareHref(), shareText() (+1 more)

### Community 24 - "rizky-project-web"
Cohesion: 0.33
Nodes (5): Deploy, Menjalankan (dev), Peta domain (produksi, semua di VPS), rizky-project-web, Struktur — satu modul, satu folder

### Community 25 - "UndanganSaya.vue"
Cohesion: 0.21
Nodes (9): addGuest(), { data, isLoading, isError, error }, { guestLink, waMessage, waHref, copy, copied }, invitations, loadGuests(), loadRsvp(), open, panel (+1 more)

### Community 26 - "Membuat Tema Baru"
Cohesion: 0.33
Nodes (5): Checklist sebelum rilis tema, Langkah, Membedakan satu section saja, Membuat Tema Baru, Menambah varian gaya pada section (contoh: hero.style baru)

### Community 27 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Conventions, Project, Structure

### Community 29 - "client.js"
Cohesion: 0.31
Nodes (3): { data, isLoading, isError }, api, csrf()

### Community 30 - "SectionWrapper.vue"
Cohesion: 0.20
Nodes (7): items, pria, props, spesial, wanita, copied, copy()

### Community 31 - "registry.js"
Cohesion: 0.20
Nodes (6): mildness/tokens.js, themes, senja/tokens.js, FEATURES, STEPS, THEMES

### Community 32 - "UcapanDoa.vue"
Cohesion: 0.38
Nodes (5): gate, invitationId, { list, setApproved, remove }, base(), useGuestbookAdmin()

### Community 33 - "useInvitation.js"
Cohesion: 0.47
Nodes (3): { invitation, isLoading, isError, error }, useActiveInvitation(), useMyInvitations()

### Community 34 - "CoupleSection.vue"
Cohesion: 0.40
Nodes (4): hasPhotos, people, props, style

## Knowledge Gaps
- **243 isolated node(s):** `props`, `CARD_STYLES`, `uploading`, `SECTIONS`, `props` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `_template/Layout.vue` connect `Acara.vue` to `CoverSection.vue`, `Community 11`, `assetUrl`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `api` connect `client.js` to `UcapanDoa.vue`, `useInvitation.js`, `Community 9`, `Rsvp.vue`, `Beranda.vue`, `UndanganSaya.vue`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `assetUrl()` connect `KisahCinta.vue` to `Community 2`, `CoupleSection.vue`, `Community 10`, `CoverSection.vue`, `assetUrl`, `SectionWrapper.vue`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **What connects `props`, `CARD_STYLES`, `uploading` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07977207977207977 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07586206896551724 - nodes in this community are weakly interconnected._