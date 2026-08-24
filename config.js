// config.js - Global Environment Variables

const ENV = {
  // Toggle this to 'production' when deploying to a live server
  mode: 'development',

  // Local Docker Moodle (backend moved off the public ngrok tunnel)
  development: {
    MOODLE_URL: 'http://localhost:8000',
    SERVICE: 'moodle_mobile_app'
  },

  // NOTE: the frail-rework-mobile ngrok tunnel has been retired.
  // Update this before the next Vercel deploy, or production calls will fail.
  production: {
    MOODLE_URL: '',
    SERVICE: 'moodle_mobile_app'
  }
};

// Export the active configuration to the global window object
window.ATHENA_CONFIG = ENV[ENV.mode];