// utils.js - Shared utility functions for Athena
// Load after: config.js, auth.js, api.js

/**
 * Escape HTML entities to prevent XSS when injecting text into innerHTML.
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize HTML by removing dangerous elements and event handlers.
 * Use this when you need to render rich HTML from untrusted sources.
 */
function sanitizeHtml(html) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  doc.querySelectorAll('script, iframe, object, embed, form, input, textarea, select, button').forEach(el => el.remove());
  doc.querySelectorAll('*').forEach(el => {
    for (const attr of [...el.attributes]) {
      if (attr.name.startsWith('on') || attr.value.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}

/**
 * Format a Unix timestamp into a human-readable date string.
 * Returns 'No deadline' for falsy or zero values.
 */
function formatDate(timestamp) {
  if (!timestamp || Number(timestamp) <= 0) {
    return 'No deadline';
  }
  return new Date(Number(timestamp) * 1000).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a byte count into a human-readable file size string.
 */
function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

/**
 * Show a toast/message element with text and type (error/success).
 * Pass the DOM element and optional type.
 */
function showMessageTo(element, text, type = 'error') {
  if (!element) return;
  element.textContent = text;
  element.className = `message visible ${type}`;
}

/**
 * Hide a toast/message element.
 */
function hideMessageFrom(element) {
  if (!element) return;
  element.className = 'message';
  element.textContent = '';
}
