# AGENTS.md

Athena: static, no-build LMS dashboard frontend for Moodle. Each page is one self-contained HTML file (inline CSS + inline vanilla JS). There is no package.json, bundler, linter, or test suite — do not invent build steps.

## Backend & auth

- All data comes from Moodle Web Services REST API. Login: `POST {MOODLE_URL}/login/token.php` with `service=moodle_mobile_app`. Data calls: `{MOODLE_URL}/webservice/rest/server.php?wsfunction=...&wstoken=...&moodlewsrestformat=json`.
- Base URL comes from `config.js` → `window.ATHENA_CONFIG.MOODLE_URL`. `ENV.mode` switches between `development` (`http://localhost:8000`) and `production` (ngrok tunnel); it currently points at production, so flip to `development` when testing against a local Moodle.
- User token lives in `localStorage.madar_user_token` (+ `madar_username`), set by `login.html`. Most pages redirect to `login.html` when the token is missing.
- User registration must be handled server-side. Do not embed admin tokens in client-side code.

## Conventions

- Shared JS layer (classic scripts, no build step). Load order per page: `config.js` → `js/auth.js` → `js/api.js` → `js/utils.js`.
  - `js/auth.js`: `getUserToken()`, `requireAuth()` (redirects to login), `logout()`, `handleAuthError()` (auto-logout on expired tokens).
  - `js/api.js`: single canonical `moodleRequest(wsfunction, params, options)` — POST form-urlencoded with `wstoken` + `moodlewsrestformat=json`; throws on HTTP errors AND on Moodle `{exception}` payloads (Moodle returns HTTP 200 for web-service errors). Includes 30s request timeout via AbortController.
  - `js/utils.js`: shared utilities — `escapeHtml()`, `sanitizeHtml()`, `formatDate()`, `formatFileSize()`, `showMessageTo()`, `hideMessageFrom()`.
  - Migrated so far: `index`, `courses`, `course`, `assignments`, `assignment`, `quiz`, `grades`, `resources`, `resource`, `forum`, `profile`. Only `login.html` and `register.html` intentionally stay inline (`/login/token.php` is unauthenticated; register uses a server-side endpoint).
- Shared CSS: `css/style.css` loaded via `<link>` tag in each page's `<head>`. Contains unified `:root` design tokens, base reset, body/typography, shared header/topbar styles, and shared components (cards, buttons, filter tabs, progress bars, status badges, form inputs, messages, spinners).
- Icons use Lucide from the unpkg CDN. After dynamically injecting DOM, call `lucide.createIcons()` again or new icons won't render.

## Security

- Never embed tokens in URL query strings — pass via POST body or headers.
- Sanitize all HTML from Moodle before injecting via `innerHTML` — use `sanitizeHtml()` from utils.js.
- Use `escapeHtml()` for user-sourced text (names, emails, etc.) before innerHTML injection.

## Verifying changes

- Serve over HTTP (e.g. `python -m http.server 5500`) and open `index.html`; `file://` breaks the API calls.
- Real verification needs a running Moodle backend with web services enabled and a valid account — there are no mocks or fixtures.
