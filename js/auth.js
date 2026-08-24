// auth.js - Shared authentication helpers for Athena

function getUserToken() {
  return localStorage.getItem('madar_user_token');
}

function requireAuth() {
  if (!getUserToken()) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('madar_user_token');
  localStorage.removeItem('madar_username');
  window.location.href = 'login.html';
}
