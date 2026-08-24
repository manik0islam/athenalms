# AGENTS.md

Athena: static, no-build LMS dashboard frontend for Moodle. Each page is one self-contained HTML file (inline CSS + inline vanilla JS). There is no package.json, bundler, linter, or test suite — do not invent build steps.

## Backend & auth

- All data comes from Moodle Web Services REST API. Login: `POST {MOODLE_URL}/login/token.php` with `service=moodle_mobile_app`. Data calls: `{MOODLE_URL}/webservice/rest/server.php?wsfunction=...&wstoken=...&moodlewsrestformat=json`.
- Base URL comes from `config.js` → `window.ATHENA_CONFIG.MOODLE_URL`. `ENV.mode` switches between `development` (`http://localhost:8000`) and `production` (ngrok tunnel); it currently points at production, so flip to `development` when testing against a local Moodle.
- User token lives in `localStorage.madar_user_token` (+ `madar_username`), set by `login.html`. Most pages redirect to `login.html` when the token is missing.
- `register.html` hardcodes a Moodle admin master token (`ADMIN_TOKEN`) used for `core_user_create_users` — treat as sensitive; don't copy it into other files or logs.

## Conventions

- No shared JS/CSS: the auth guard, `moodleRequest()` helper, header markup, and design tokens (`:root` variables) are duplicated per page. Any change to these patterns must be applied to every affected HTML file.
- Icons use Lucide from the unpkg CDN. After dynamically injecting DOM, call `lucide.createIcons()` again or new icons won't render.

## Verifying changes

- Serve over HTTP (e.g. `python -m http.server 5500`) and open `index.html`; `file://` breaks the API calls.
- Real verification needs a running Moodle backend with web services enabled and a valid account — there are no mocks or fixtures.
