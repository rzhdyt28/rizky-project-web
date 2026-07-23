# Graph Report - rizky-project-web  (2026-07-24)

## Corpus Check
- 162 files · ~48,960 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 726 nodes · 961 edges · 51 communities (46 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2236b20f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- GallerySection.vue
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
- Community 14
- KisahCinta.vue
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
- index.js
- client.js
- dashboard/pages/Login.vue
- skripsi/pages/Login.vue
- useReveal.js
- Register.vue
- UcapanDoa.vue
- CasesList.vue
- RsvpSection.vue
- SectionRenderer.vue
- invitationFormOptions.js
- main.js
- GiftSection.vue
- UcapanDoa.vue
- useInvitationForm.js
- SectionVisibilityChecklist.vue
- EventSection.vue

## God Nodes (most connected - your core abstractions)
1. `assetUrl()` - 35 edges
2. `senja/Layout.vue` - 27 edges
3. `api` - 17 edges
4. `dashboard/pages/Login.vue` - 10 edges
5. `skripsi/pages/Login.vue` - 10 edges
6. `useCrudResource()` - 10 edges
7. `toMapsEmbed()` - 8 edges
8. `_template/Layout.vue` - 8 edges
9. `skripsi/stores/auth.js` - 8 edges
10. `shared/stores/auth.js` - 8 edges

## Surprising Connections (you probably didn't know these)
- `useGuestShare()` --indirect_call--> `copy()`  [INFERRED]
  src/modules/dashboard/composables/useGuestShare.js → src/modules/invitation/themes/_core/sections/gift/GiftSection.vue
- `cardPhotoUrl()` --calls--> `assetUrl()`  [EXTRACTED]
  src/modules/invitation/themes/senja/Layout.vue → src/modules/invitation/composables/assets.js
- `screenStyle()` --calls--> `assetUrl()`  [EXTRACTED]
  src/modules/invitation/themes/senja/Layout.vue → src/modules/invitation/composables/assets.js
- `useMyInvitations()` --indirect_call--> `base()`  [INFERRED]
  src/modules/invitation/composables/useInvitation.js → src/modules/invitation/composables/useGuestbookAdmin.js
- `onBgFile()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/components/SectionDisplayFields.vue → src/modules/invitation/composables/useThemeUpload.js

## Import Cycles
- None detected.

## Communities (51 total, 5 thin omitted)

### Community 0 - "GallerySection.vue"
Cohesion: 0.13
Nodes (14): activeStyle, closeLightbox(), currentPhoto, gridPage, gridPageCount, lightboxIndex, lightboxNext(), lightboxPrev() (+6 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (24): FONT_CATEGORY_VAR, activeStyle, coverCd, dateDots, elVars, emit, firstEvent, heroPhoto (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (11): dateLong, props, quoteText, activeLayout, layout, LAYOUTS, now, numeralStyle (+3 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (13): blankElements(), blankForm(), blankSection(), SECTION_ELEMENTS, SECTION_KEYS, useInvitationForm(), { data: themes }, { form, applyInvitation, applyLook } (+5 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (23): addAlternative(), addCriterion(), alternativeLabel, alternatives, busy, calculatedAt, canCalculate, criteria (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (10): { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, sectionHeight, countdown, animation, sectionCard, sectionFontVars, sectionCardBgPhoto, hero }, { data, isLoading, isError }, features, invitation, PRELOADED, route, slug, theme (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (16): senja/Layout.vue, cardOf(), cardPhotoUrl(), ctx, dateLong, firstEvent, leftBgStyle, opened (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (31): autoprefixer, axios, gsap, dependencies, axios, gsap, pinia, @tanstack/vue-query (+23 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (6): auth, MENU, router, sidebarOpen, theme, useThemeStore

### Community 9 - "Community 9"
Cohesion: 0.06
Nodes (31): STATUS_LABEL, useGuestShare(), viewUrl(), auth, { copy, copied }, { data, isLoading, isError, error }, shareHref(), shareText() (+23 more)

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (8): skripsi/pages/Login.vue, auth, busy, email, error, password, route, router

### Community 11 - "Community 11"
Cohesion: 0.14
Nodes (11): activeStyle, closeLightbox(), currentStory, lightboxIndex, lightboxNext(), lightboxPrev(), onKeydown(), onTouchEnd() (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (16): activeCorners, cardOf(), cardPhotoUrl(), ctx, floralDefaultVisible, heroCardPhotoUrl, heroCardStyle, heroFontVars (+8 more)

### Community 17 - "KisahCinta.vue"
Cohesion: 0.05
Nodes (27): isOpen, isSticky, usePortfolio(), usePortfolioDocumentation(), closeLightbox(), { experiences, loading, error, fetchDocumentation }, handleKeydown(), { lang, toggleLang, t } (+19 more)

### Community 19 - "client.js"
Cohesion: 0.14
Nodes (10): auth, busy, loading, newAlternativeLabel, newTitle, recentCases, router, showNewCaseForm (+2 more)

### Community 20 - "GaleriFoto.vue"
Cohesion: 0.05
Nodes (38): { invitation, isLoading, isError, error }, useEditableForm(), { editingId, form, err, startEdit, resetForm, submit }, EMPTY, gate, invitationId, { list, create, update, remove }, caption (+30 more)

### Community 21 - "Rsvp.vue"
Cohesion: 0.28
Nodes (6): ATTENDANCE_LABEL, gate, invitationId, { list }, rsvpExportUrl(), useRsvpList()

### Community 23 - "useInvitation.js"
Cohesion: 0.06
Nodes (23): CORE, entries, props, activeStyle, items, pria, props, spesial (+15 more)

### Community 24 - "rizky-project-web"
Cohesion: 0.33
Nodes (5): Deploy, Menjalankan (dev), Peta domain (produksi, semua di VPS), rizky-project-web, Struktur — satu modul, satu folder

### Community 25 - "CountdownSection.vue"
Cohesion: 0.24
Nodes (3): PRESETS, setRevealScroller(), vReveal

### Community 26 - "Membuat Tema Baru"
Cohesion: 0.33
Nodes (6): themes/_template/README.md, Checklist sebelum rilis tema, Langkah, Membedakan satu section saja, Membuat Tema Baru, Menambah varian gaya pada section (contoh: hero.style baru)

### Community 27 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Conventions, Project, Structure

### Community 29 - "_template/Layout.vue"
Cohesion: 0.14
Nodes (10): emit, ornament, photo, props, initials, props, _template/Layout.vue, ctx (+2 more)

### Community 31 - "index.js"
Cohesion: 0.25
Nodes (6): auth, busy, error, form, router, useSkripsiAuthStore

### Community 32 - "client.js"
Cohesion: 0.36
Nodes (5): { data, isLoading, isError }, skripsi/stores/auth.js, api, csrf(), shared/stores/auth.js

### Community 33 - "dashboard/pages/Login.vue"
Cohesion: 0.22
Nodes (8): dashboard/pages/Login.vue, auth, busy, email, error, password, route, router

### Community 34 - "skripsi/pages/Login.vue"
Cohesion: 0.17
Nodes (6): emit, floatingIndex, floatingPageIdx, floatingPagesRaw, floatingThumbs, props

### Community 35 - "useReveal.js"
Cohesion: 0.40
Nodes (3): audio, playing, props

### Community 36 - "Register.vue"
Cohesion: 0.06
Nodes (29): ELEMENTS, props, ELEMENTS, ELEMENTS, ELEMENTS, ELEMENTS, ELEMENTS, bgSource (+21 more)

### Community 37 - "UcapanDoa.vue"
Cohesion: 0.17
Nodes (8): activeStyle, caption, creditDate, embedSrc, eyebrow, isLocalFile, props, STYLES

### Community 38 - "CasesList.vue"
Cohesion: 0.22
Nodes (7): emit, onTouchEnd(), page, pages, prev(), props, total

### Community 39 - "RsvpSection.vue"
Cohesion: 0.20
Nodes (4): themes, FEATURES, STEPS, THEMES

### Community 40 - "SectionRenderer.vue"
Cohesion: 0.33
Nodes (3): hexToRgba(), toEmbedUrl(), useThemeOptions()

### Community 41 - "invitationFormOptions.js"
Cohesion: 0.25
Nodes (3): activeStyle, props, STYLES

### Community 42 - "main.js"
Cohesion: 0.24
Nodes (7): app, CENTRAL_HOSTS, centralRoutes, isCentralHost(), router, tenantRoutes, useAuthStore

### Community 43 - "GiftSection.vue"
Cohesion: 0.11
Nodes (10): active, list, props, assetUrl(), emit, emit, emit, emit (+2 more)

### Community 45 - "useInvitationForm.js"
Cohesion: 0.50
Nodes (4): cases, load(), loading, removeCase()

### Community 50 - "EventSection.vue"
Cohesion: 0.07
Nodes (23): gate, invitationId, { list, setApproved, remove }, base(), useGuestbookAdmin(), useActiveInvitation(), useGuestbook(), useMyInvitations() (+15 more)

## Knowledge Gaps
- **362 isolated node(s):** `HERO_TEXT_ELEMENTS`, `SECTION_KEYS`, `SECTION_ELEMENTS`, `{ invitation, isLoading, isError, error }`, `{ data: themes }` (+357 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `api` connect `client.js` to `Community 4`, `Community 9`, `useInvitationForm.js`, `EventSection.vue`, `client.js`, `GaleriFoto.vue`, `Rsvp.vue`?**
  _High betweenness centrality (0.161) - this node is a cross-community bridge._
- **Why does `assetUrl()` connect `GiftSection.vue` to `skripsi/pages/Login.vue`, `useReveal.js`, `UcapanDoa.vue`, `CasesList.vue`, `Community 6`, `Community 11`, `GaleriFoto.vue`, `CountdownSection.vue`, `_template/Layout.vue`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `senja/Layout.vue` connect `Community 6` to `Community 1`, `useReveal.js`, `GiftSection.vue`, `Community 12`, `useInvitation.js`, `CountdownSection.vue`, `_template/Layout.vue`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **What connects `HERO_TEXT_ELEMENTS`, `SECTION_KEYS`, `SECTION_ELEMENTS` to the rest of the system?**
  _362 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GallerySection.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.12631578947368421 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._