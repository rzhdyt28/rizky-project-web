# Graph Report - rizky-project-web  (2026-07-22)

## Corpus Check
- 162 files · ~48,131 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 730 nodes · 1053 edges · 49 communities (46 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9939a9b7`
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
- CoupleSection.vue
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
- LoveStoryStyleGrid.vue
- EventSection.vue
- GiftStyleStack.vue

## God Nodes (most connected - your core abstractions)
1. `assetUrl()` - 49 edges
2. `api` - 18 edges
3. `useCrudResource()` - 10 edges
4. `toMapsEmbed()` - 8 edges
5. `uploadThemeFile()` - 7 edges
6. `vReveal` - 6 edges
7. `useGuestShare()` - 5 edges
8. `useMyInvitations()` - 5 edges
9. `load()` - 5 edges
10. `useSkripsiAuthStore` - 5 edges

## Surprising Connections (you probably didn't know these)
- `useGuestShare()` --indirect_call--> `copy()`  [INFERRED]
  src/modules/dashboard/composables/useGuestShare.js → src/modules/invitation/themes/_core/sections/gift/GiftSection.vue
- `onCardBgFile()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/components/SectionDisplayFields.vue → src/modules/invitation/composables/useThemeUpload.js
- `handleUpload()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/pages/EditUndangan.vue → src/modules/invitation/composables/useThemeUpload.js
- `handleSlideshowUpload()` --calls--> `uploadThemeFile()`  [EXTRACTED]
  src/modules/dashboard/pages/EditUndangan.vue → src/modules/invitation/composables/useThemeUpload.js
- `cardPhotoUrl()` --calls--> `assetUrl()`  [EXTRACTED]
  src/modules/invitation/themes/mildness/Layout.vue → src/modules/invitation/composables/assets.js

## Import Cycles
- None detected.

## Communities (49 total, 3 thin omitted)

### Community 0 - "GallerySection.vue"
Cohesion: 0.05
Nodes (27): activeStyle, closeLightbox(), currentPhoto, gridPage, gridPageCount, lightboxIndex, lightboxNext(), lightboxPrev() (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (26): activeLayout, layout, LAYOUTS, now, numeralStyle, parts, props, timer (+18 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (7): assetUrl(), emit, emit, emit, emit, emit, emit

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (39): ELEMENTS, props, ELEMENTS, ELEMENTS, ELEMENTS, ELEMENTS, ELEMENTS, bgSource (+31 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (23): addAlternative(), addCriterion(), alternativeLabel, alternatives, busy, calculatedAt, canCalculate, criteria (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (16): usePublicInvitation(), { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, sectionHeight, countdown, animation, sectionCard, sectionFontVars, sectionCardBgPhoto, hero }, { data, isLoading, isError }, features, invitation, PRELOADED, route, slug (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (15): cardOf(), cardPhotoUrl(), ctx, dateLong, firstEvent, leftBgStyle, opened, props (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.06
Nodes (31): autoprefixer, axios, gsap, dependencies, axios, gsap, pinia, @tanstack/vue-query (+23 more)

### Community 8 - "Community 8"
Cohesion: 0.22
Nodes (10): STATUS_LABEL, useGuestShare(), viewUrl(), auth, { copy, copied }, { data, isLoading, isError, error }, shareHref(), shareText() (+2 more)

### Community 9 - "Community 9"
Cohesion: 0.12
Nodes (12): busy, err, form, gate, { guestLink, waMessage, waHref, copy, copied }, guestsQuery, importFile, importing (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.21
Nodes (9): addGuest(), { data, isLoading, isError, error }, { guestLink, waMessage, waHref, copy, copied }, invitations, loadGuests(), loadRsvp(), open, panel (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (11): activeStyle, closeLightbox(), currentStory, lightboxIndex, lightboxNext(), lightboxPrev(), onKeydown(), onTouchEnd() (+3 more)

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (15): activeCorners, cardOf(), cardPhotoUrl(), ctx, heroCardPhotoUrl, heroCardStyle, heroFontVars, heroScreenStyle (+7 more)

### Community 17 - "KisahCinta.vue"
Cohesion: 0.05
Nodes (27): isOpen, isSticky, usePortfolio(), usePortfolioDocumentation(), closeLightbox(), { experiences, loading, error, fetchDocumentation }, handleKeydown(), { lang, toggleLang, t } (+19 more)

### Community 18 - "CoverSection.vue"
Cohesion: 0.20
Nodes (8): coverCd, dateLong, elVars, emit, firstEvent, heroSlides, props, TEXT_ELEMENTS

### Community 19 - "client.js"
Cohesion: 0.14
Nodes (10): auth, busy, loading, newAlternativeLabel, newTitle, recentCases, router, showNewCaseForm (+2 more)

### Community 20 - "GaleriFoto.vue"
Cohesion: 0.06
Nodes (37): useEditableForm(), { editingId, form, err, startEdit, resetForm, submit }, EMPTY, gate, invitationId, { list, create, update, remove }, caption, err (+29 more)

### Community 21 - "Rsvp.vue"
Cohesion: 0.28
Nodes (6): ATTENDANCE_LABEL, gate, invitationId, { list }, rsvpExportUrl(), useRsvpList()

### Community 23 - "useInvitation.js"
Cohesion: 0.17
Nodes (7): activeStyle, items, pria, props, spesial, STYLES, wanita

### Community 24 - "rizky-project-web"
Cohesion: 0.33
Nodes (5): Deploy, Menjalankan (dev), Peta domain (produksi, semua di VPS), rizky-project-web, Struktur — satu modul, satu folder

### Community 25 - "CountdownSection.vue"
Cohesion: 0.24
Nodes (3): PRESETS, setRevealScroller(), vReveal

### Community 26 - "Membuat Tema Baru"
Cohesion: 0.33
Nodes (5): Checklist sebelum rilis tema, Langkah, Membedakan satu section saja, Membuat Tema Baru, Menambah varian gaya pada section (contoh: hero.style baru)

### Community 27 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Conventions, Project, Structure

### Community 29 - "_template/Layout.vue"
Cohesion: 0.14
Nodes (9): emit, ornament, photo, props, initials, props, ctx, opened (+1 more)

### Community 30 - "CoupleSection.vue"
Cohesion: 0.12
Nodes (8): activeStyle, eyebrowText, hasPhotos, people, props, showEyebrow, styleName, STYLES

### Community 31 - "index.js"
Cohesion: 0.50
Nodes (3): active, list, props

### Community 32 - "client.js"
Cohesion: 0.26
Nodes (7): { data, isLoading, isError }, cases, load(), loading, removeCase(), api, csrf()

### Community 33 - "dashboard/pages/Login.vue"
Cohesion: 0.20
Nodes (8): auth, busy, email, error, password, route, router, useAuthStore

### Community 34 - "skripsi/pages/Login.vue"
Cohesion: 0.22
Nodes (7): auth, busy, email, error, password, route, router

### Community 35 - "useReveal.js"
Cohesion: 0.40
Nodes (3): audio, playing, props

### Community 36 - "Register.vue"
Cohesion: 0.25
Nodes (6): auth, busy, error, form, router, useSkripsiAuthStore

### Community 37 - "UcapanDoa.vue"
Cohesion: 0.17
Nodes (8): activeStyle, caption, creditDate, embedSrc, eyebrow, isLocalFile, props, STYLES

### Community 38 - "CasesList.vue"
Cohesion: 0.29
Nodes (3): app, router, useThemeStore

### Community 39 - "RsvpSection.vue"
Cohesion: 0.17
Nodes (9): useRsvp(), activeStyle, done, error, form, props, rsvp, STYLES (+1 more)

### Community 40 - "SectionRenderer.vue"
Cohesion: 0.40
Nodes (3): CORE, entries, props

### Community 41 - "invitationFormOptions.js"
Cohesion: 0.40
Nodes (3): dateLong, props, quoteText

### Community 42 - "main.js"
Cohesion: 0.29
Nodes (5): auth, MENU, router, sidebarOpen, theme

### Community 43 - "GiftSection.vue"
Cohesion: 0.40
Nodes (4): activeStyle, copied, props, STYLES

### Community 44 - "UcapanDoa.vue"
Cohesion: 0.24
Nodes (8): { invitation, isLoading, isError, error }, gate, invitationId, { list, setApproved, remove }, base(), useGuestbookAdmin(), useActiveInvitation(), useMyInvitations()

### Community 45 - "useInvitationForm.js"
Cohesion: 0.36
Nodes (6): blankElements(), blankForm(), blankSection(), SECTION_ELEMENTS, SECTION_KEYS, useInvitationForm()

### Community 49 - "LoveStoryStyleGrid.vue"
Cohesion: 0.50
Nodes (4): CENTRAL_HOSTS, centralRoutes, isCentralHost(), tenantRoutes

### Community 50 - "EventSection.vue"
Cohesion: 0.07
Nodes (14): useGuestbook(), hexToRgba(), toEmbedUrl(), toMapsEmbed(), useThemeOptions(), activeStyle, props, STYLES (+6 more)

## Knowledge Gaps
- **362 isolated node(s):** `name`, `private`, `type`, `dev`, `build` (+357 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `assetUrl()` connect `Community 2` to `GallerySection.vue`, `Community 1`, `useReveal.js`, `UcapanDoa.vue`, `Community 6`, `Community 11`, `Community 12`, `CoverSection.vue`, `GaleriFoto.vue`, `GiftStyleStack.vue`, `CountdownSection.vue`, `_template/Layout.vue`, `CoupleSection.vue`, `index.js`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `api` connect `client.js` to `Community 3`, `Community 4`, `Register.vue`, `Community 8`, `Community 9`, `Community 10`, `UcapanDoa.vue`, `client.js`, `GaleriFoto.vue`, `Rsvp.vue`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `useActiveInvitation()` connect `UcapanDoa.vue` to `Community 3`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **What connects `name`, `private`, `type` to the rest of the system?**
  _362 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GallerySection.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.0545876887340302 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06050420168067227 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._