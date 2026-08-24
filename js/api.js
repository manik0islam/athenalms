// api.js - Shared Moodle Web Services API wrapper for Athena
// Requires: config.js (window.ATHENA_CONFIG) and auth.js (getUserToken)

async function moodleRequest(wsfunction, params = {}) {
  const token = getUserToken();

  if (!token) {
    throw new Error('Missing Moodle token.');
  }

  const body = new URLSearchParams();
  body.append('wstoken', token);
  body.append('wsfunction', wsfunction);
  body.append('moodlewsrestformat', 'json');

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    body.append(key, value);
  }

  const response = await fetch(`${window.ATHENA_CONFIG.MOODLE_URL}/webservice/rest/server.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!response.ok) {
    throw new Error(`Moodle returned HTTP ${response.status}`);
  }

  const data = await response.json();

  if (data && data.exception) {
    throw new Error(data.message || 'Moodle web service error');
  }

  return data;
}
