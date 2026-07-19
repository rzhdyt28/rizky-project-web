## Project

Vue 3 + Vite frontend for the invitation/event platform. Consumes the Laravel API in the sibling `rizky-project` repo (Sanctum cookie-based auth). This is the **frontend** half — see `rizky-project/CLAUDE.md` for the **API/backend** half.

## Structure

Feature-module layout under `src/modules/<module>/` (pages, components, composables), plus `src/shared/` for cross-cutting concerns:

- `shared/api/client.js` — the single axios instance every module must use (`withCredentials: true`, `withXSRFToken: true`; call `csrf()` before login/register to prime the Sanctum CSRF cookie).
- `shared/stores/auth.js` — Pinia auth store.
- `modules/invitation/` — public invitation rendering: `themes/` holds per-theme presentational variants (`_core` = shared section components, `_template` = scaffold for new themes, `mildness`/`senja` = concrete themes with `tokens.js` + `Layout.vue` + `sections/`), driven by `themes/registry.js`. Mirrors the backend's `Theme` model (which now has `parent_id` for theme inheritance).
- `modules/dashboard/` — authenticated user area (e.g. `MyInvitations.vue`).
- `modules/landing/`, `modules/portfolio/`, `modules/agent-monitoring/` — other standalone areas.
- `modules/_template/` — scaffold for adding a new module.

Stack: Vue 3, Vue Router, Pinia, @tanstack/vue-query, axios, Tailwind, GSAP.

## Conventions

- New invitation themes: copy `modules/invitation/themes/_template/` (see its `README.md`), register in `themes/registry.js`.
- All backend calls go through `shared/api/client.js` — don't create ad-hoc axios instances.
- `VITE_API_URL` is empty in dev (Vite proxies to local Laravel); set explicitly in `.env.production`.
