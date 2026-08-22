// config.js - Global Environment Variables

const ENV = {
  // Toggle this to 'production' when deploying to a live server
  mode: 'development', 
  
  development: {
    MOODLE_URL: 'http://localhost:8000',
    SERVICE: 'moodle_mobile_app'
  },
  
  production: {
    MOODLE_URL: 'https://moodle.your-live-domain.com', // We will set this in Stage 5.4
    SERVICE: 'moodle_mobile_app' // We will secure this in Stage 5.6
  }
};

// Export the active configuration to the global window object
window.ATHENA_CONFIG = ENV[ENV.mode];