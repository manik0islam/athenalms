// auth.js - Shared authentication helpers for Athena

function getUserToken() {
  return localStorage.getItem('madar_user_token');
}

function requireAuth() {
  if (!getUserToken()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function logout() {
  localStorage.removeItem('madar_user_token');
  localStorage.removeItem('madar_username');
  window.location.href = 'login.html';
}

/**
 * Handle an API error. If it indicates an invalid/expired token,
 * clear credentials and redirect to login.
 */
function handleAuthError(error) {
  const msg = (error && error.message) || '';
  const isAuthError =
    msg.includes('invalid token') ||
    msg.includes('token is not valid') ||
    msg.includes('Missing Moodle token') ||
    msg.includes('HTTP 401') ||
    msg.includes('HTTP 403');

  if (isAuthError && getUserToken()) {
    logout();
    return true;
  }
  return false;
}
