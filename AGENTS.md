# AGENTS.md

Athena: static, no-build LMS dashboard frontend for Moodle. Each page is one self-contained HTML file (inline CSS + inline vanilla JS). There is no package.json, bundler, linter, or test suite — do not invent build steps.

## Backend & auth

- All data comes from Moodle Web Services REST API. Login: `POST {MOODLE_URL}/login/token.php` with `service=moodle_mobile_app`. Data calls: `{MOODLE_URL}/webservice/rest/server.php?wsfunction=...&wstoken=...&moodlewsrestformat=json`.
- Base URL comes from `config.js` → `window.ATHENA_CONFIG.MOODLE_URL`. `ENV.mode` switches between `development` (`http://localhost:8000`) and `production` (ngrok tunnel); it currently points at production, so flip to `development` when testing against a local Moodle.
- User token lives in `localStorage.madar_user_token` (+ `madar_username`), set by `login.html`. Most pages redirect to `login.html` when the token is missing.
- `register.html` hardcodes a Moodle admin master token (`ADMIN_TOKEN`) used for `core_user_create_users` — treat as sensitive; don't copy it into other files or logs.

## Conventions

- Shared JS layer (classic scripts, no build step). Load order per page: `config.js` → `js/auth.js` → `js/api.js`.
  - `js/auth.js`: `getUserToken()`, `requireAuth()` (redirects to login), `logout()`.
  - `js/api.js`: single canonical `moodleRequest(wsfunction, params)` — POST form-urlencoded with `wstoken` + `moodlewsrestformat=json`; throws on HTTP errors AND on Moodle `{exception}` payloads (Moodle returns HTTP 200 for web-service errors).
  - Migrated so far: `index`, `courses`, `course`, `assignments`, `assignment`, `quiz`, `grades`, `resources`, `resource`, `forum`, `profile`. Only `login.html` and `register.html` intentionally stay inline (`/login/token.php` is unauthenticated; register uses a local admin master token).
- Header markup and CSS design tokens (`:root` variables) remain duplicated per page; keep them in sync manually when changing shared visual patterns.
- Icons use Lucide from the unpkg CDN. After dynamically injecting DOM, call `lucide.createIcons()` again or new icons won't render.

## Verifying changes

- Serve over HTTP (e.g. `python -m http.server 5500`) and open `index.html`; `file://` breaks the API calls.
- Real verification needs a running Moodle backend with web services enabled and a valid account — there are no mocks or fixtures.
