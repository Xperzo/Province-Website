// public/js/config.js
// If you host frontend and backend on the same domain, window.API_BASE can be empty.
// If not, set process env or edit here.
window.API_BASE = window.API_BASE || (() => {
  // dev: if running from file or from localhost, default to localhost:3000 or 3001
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    // if you mapped Docker to 3001 (or run server on 3001), set to that port
    return 'http://'+location.hostname + (location.port ? ':' + location.port : '') ;
  }
  // production: default to empty so absolute paths are used (or set by build)
  return '';
})();
