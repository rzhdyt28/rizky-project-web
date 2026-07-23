# Graph Report - rizky-project-web  (2026-07-24)

## Corpus Check
- 162 files · ~48,245 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 730 nodes · 900 edges · 64 communities (54 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c4a6cb5`
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
- main.js
- GiftSection.vue
- UcapanDoa.vue
- useInvitationForm.js
- SectionElementStyleFields.vue
- toMapsEmbed
- EventSection.vue
- LoveStoryStyleGrid.vue
- EventSection.vue
- CoHostSectionFields.vue
- invitationFormOptions.js
- GiftStyleStack.vue
- VideoSectionFields.vue
- useThemeOptions.js
- GlobalStyleSectionFields.vue
- HeroSectionFields.vue
- RsvpGuestbookSectionFields.vue
- SectionVisibilityChecklist.vue

## God Nodes (most connected - your core abstractions)
1. `api` - 13 edges
2. `dashboard/pages/Login.vue` - 10 edges
3. `useCrudResource()` - 10 edges
4. `assetUrl()` - 9 edges
5. `toMapsEmbed()` - 8 edges
6. `_template/Layout.vue` - 8 edges
7. `shared/stores/auth.js` - 7 edges
8. `vReveal` - 6 edges
9. `Membuat Tema Baru` - 5 edges
10. `load()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `useGuestShare()` --indirect_call--> `copy()`  [INFERRED]
  src/modules/dashboard/composables/useGuestShare.js → src/modules/invitation/themes/_core/sections/gift/GiftSection.vue
- `useMyInvitations()` --indirect_call--> `base()`  [INFERRED]
  src/modules/invitation/composables/useInvitation.js → src/modules/invitation/composables/useGuestbookAdmin.js
- `useGifts()` --calls--> `useCrudResource()`  [EXTRACTED]
  src/modules/invitation/composables/useGifts.js → src/shared/composables/useCrudResource.js
- `shareText()` --calls--> `viewUrl()`  [EXTRACTED]
  src/modules/dashboard/pages/Beranda.vue → src/modules/dashboard/composables/useGuestShare.js
- `useEvents()` --calls--> `useCrudResource()`  [EXTRACTED]
  src/modules/invitation/composables/useEvents.js → src/shared/composables/useCrudResource.js

## Import Cycles
- None detected.

## Communities (64 total, 10 thin omitted)

### Community 0 - "GallerySection.vue"
Cohesion: 0.05
Nodes (26): activeStyle, closeLightbox(), currentPhoto, gridPage, gridPageCount, lightboxIndex, lightboxNext(), lightboxPrev() (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (29): dateLong, props, quoteText, activeLayout, layout, LAYOUTS, now, numeralStyle (+21 more)

### Community 2 - "Community 2"
Cohesion: 0.15
Nodes (7): caption, err, file, gate, invitationId, { list, upload, updateCaption, remove, reorder }, model

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (7): { data: themes }, { form, applyInvitation }, { invitation, isLoading, isError, error }, saveErr, saveOk, saving, uploading

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (23): addAlternative(), addCriterion(), alternativeLabel, alternatives, busy, calculatedAt, canCalculate, criteria (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (10): { cssVars, can, sectionOrder, labels, cover, florals, background, layoutOpts, sectionBg, sectionHeight, countdown, animation, sectionCard, sectionFontVars, sectionCardBgPhoto, hero }, { data, isLoading, isError }, features, invitation, PRELOADED, route, slug, theme (+2 more)

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
Cohesion: 0.11
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
Cohesion: 0.06
Nodes (26): auth, busy, loading, newAlternativeLabel, newTitle, recentCases, router, showNewCaseForm (+18 more)

### Community 20 - "GaleriFoto.vue"
Cohesion: 0.12
Nodes (14): { invitation, isLoading, isError, error }, useEditableForm(), { editingId, form, err, startEdit, resetForm, submit }, EMPTY, gate, invitationId, { list, create, update, remove }, { editingId, form, err, startEdit, resetForm, submit } (+6 more)

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
Cohesion: 0.13
Nodes (10): emit, ornament, photo, props, initials, props, _template/Layout.vue, ctx (+2 more)

### Community 30 - "CoupleSection.vue"
Cohesion: 0.12
Nodes (8): activeStyle, eyebrowText, hasPhotos, people, props, showEyebrow, styleName, STYLES

### Community 31 - "index.js"
Cohesion: 0.20
Nodes (9): { editingId, form, err, startEdit, resetForm, submit }, EMPTY, gate, invitationId, { list, create, update, remove }, qrisFile, TYPE_LABEL, baseUrl() (+1 more)

### Community 32 - "client.js"
Cohesion: 0.31
Nodes (4): { data, isLoading, isError }, api, csrf(), shared/stores/auth.js

### Community 33 - "dashboard/pages/Login.vue"
Cohesion: 0.09
Nodes (17): app, auth, MENU, router, sidebarOpen, theme, dashboard/pages/Login.vue, auth (+9 more)

### Community 34 - "skripsi/pages/Login.vue"
Cohesion: 0.32
Nodes (8): baseUrl(), useEvents(), baseUrl(), useGalleryPhotos(), baseUrl(), useStories(), toFormData(), useCrudResource()

### Community 35 - "useReveal.js"
Cohesion: 0.21
Nodes (7): active, list, props, assetUrl(), audio, playing, props

### Community 36 - "Register.vue"
Cohesion: 0.20
Nodes (7): ELEMENTS, ELEMENTS, emit, onBgFile(), props, uploading, uploadingCard

### Community 37 - "UcapanDoa.vue"
Cohesion: 0.17
Nodes (8): activeStyle, caption, creditDate, embedSrc, eyebrow, isLocalFile, props, STYLES

### Community 38 - "CasesList.vue"
Cohesion: 0.22
Nodes (7): emit, onTouchEnd(), page, pages, prev(), props, total

### Community 39 - "RsvpSection.vue"
Cohesion: 0.15
Nodes (8): activeStyle, done, error, form, props, rsvp, STYLES, OPTIONS

### Community 40 - "SectionRenderer.vue"
Cohesion: 0.40
Nodes (3): CORE, entries, props

### Community 42 - "main.js"
Cohesion: 0.20
Nodes (6): mildness/tokens.js, themes, senja/tokens.js, FEATURES, STEPS, THEMES

### Community 43 - "GiftSection.vue"
Cohesion: 0.20
Nodes (5): activeStyle, copied, props, STYLES, ICONS

### Community 44 - "UcapanDoa.vue"
Cohesion: 0.38
Nodes (5): gate, invitationId, { list, setApproved, remove }, base(), useGuestbookAdmin()

### Community 45 - "useInvitationForm.js"
Cohesion: 0.36
Nodes (6): blankElements(), blankForm(), blankSection(), SECTION_ELEMENTS, SECTION_KEYS, useInvitationForm()

### Community 46 - "SectionElementStyleFields.vue"
Cohesion: 0.22
Nodes (4): ELEMENTS, ELEMENTS, ELEMENTS, ELEMENTS

### Community 48 - "EventSection.vue"
Cohesion: 0.29
Nodes (3): activeStyle, props, STYLES

### Community 50 - "EventSection.vue"
Cohesion: 0.18
Nodes (6): activeStyle, error, form, gb, props, STYLES

### Community 52 - "invitationFormOptions.js"
Cohesion: 0.40
Nodes (4): BODY_FONTS, CARD_STYLES, HEADING_FONTS, SCRIPT_FONTS

### Community 53 - "GiftStyleStack.vue"
Cohesion: 0.50
Nodes (4): cases, load(), loading, removeCase()

### Community 54 - "VideoSectionFields.vue"
Cohesion: 0.50
Nodes (3): ELEMENTS, props, videoSource

### Community 55 - "useThemeOptions.js"
Cohesion: 0.67
Nodes (3): hexToRgba(), toEmbedUrl(), useThemeOptions()

## Knowledge Gaps
- **370 isolated node(s):** `props`, `uploading`, `uploadingCard`, `props`, `ELEMENTS` (+365 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `copy()` connect `Community 8` to `GiftSection.vue`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `useGuestShare()` connect `Community 8` to `Community 9`, `Community 10`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `_template/Layout.vue` connect `_template/Layout.vue` to `SectionRenderer.vue`, `useReveal.js`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **What connects `props`, `uploading`, `uploadingCard` to the rest of the system?**
  _370 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GallerySection.vue` be split into smaller, more focused modules?**
  _Cohesion score 0.0507399577167019 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05179704016913319 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.07586206896551724 - nodes in this community are weakly interconnected._