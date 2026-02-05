// public/js/api.js
const API = {
  _url(path) {
    if (path.startsWith('http')) return path;
    return (window.API_BASE || '') + path;
  },

  async request(path, opts = {}) {
    // add Authorization header if token present
    opts.headers = opts.headers || {};
    const token = localStorage.getItem('auth_token');
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;

    // handle JSON bodies automatically (but not FormData)
    if (opts.body && !(opts.body instanceof FormData)) {
      opts.headers['Content-Type'] = opts.headers['Content-Type'] || 'application/json';
      opts.body = JSON.stringify(opts.body);
    }

    opts.credentials = 'include'; // allow cookies if same-origin (keeps optional)
    const url = this._url(path);
    const res = await fetch(url, opts);
    const text = await res.text().catch(()=>null);
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch(e) { json = null; }
    if (!res.ok) throw { status: res.status, statusText: res.statusText, text, json };

    return json === null ? {} : json;
  },

  async login(creds) {
    const resp = await this.request('/api/login', { method: 'POST', body: creds });
    if (resp && resp.token) {
      localStorage.setItem('auth_token', resp.token);
    }
    return resp;
  },

  logout() {
    localStorage.removeItem('auth_token');
    // optional: call server logout to destroy session cookie
    try { this.request('/api/logout', { method: 'POST' }); } catch(e) {}
    return Promise.resolve();
  },

  me() { return this.request('/api/me'); },

  fetchActualites(limit=6) { return this.request('/api/actualites?limit=' + encodeURIComponent(limit)); },
  createActualite(payload) { return this.request('/api/actualites', { method:'POST', body: payload }); },
  updateActualite(id, payload) { return this.request('/api/actualites/' + encodeURIComponent(id), { method:'PUT', body: payload }); },
  deleteActualite(id) { return this.request('/api/actualites/' + encodeURIComponent(id), { method:'DELETE' }); },

  uploadFiles(formData) { return this.request('/api/upload', { method:'POST', body: formData }); },

  forgotPassword(username) { return this.request('/api/forgot-password', { method:'POST', body: { username } }); },
  resetPassword(token, password) { return this.request('/api/reset-password', { method:'POST', body: { token, password } }); }
};
