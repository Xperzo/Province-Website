// server.js - version nettoyée, sessions + JWT, CORS flexible, upload, CRUD, reset PW

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const DB = require('./db');
const nodemailer = require('nodemailer');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = express();

const isProd = process.env.NODE_ENV === 'production';

// ========== SECURITY: Warn about missing environment variables in production ==========
if (isProd) {
  const required = ['JWT_SECRET', 'SESSION_SECRET', 'ADMIN_PASSWORD', 'FRONTEND_ORIGIN'];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.warn('⚠️ WARNING: Missing environment variables (using defaults):');
    console.warn('  -', missing.join('\n  - '));
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me-not-for-production';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || (isProd ? '' : 'http://localhost:5500');
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

/* ----------------- MIDDLEWARES ----------------- */

// CORS - allow dev wide open, restrict in prod via FRONTEND_ORIGIN (comma-separated)
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);            // allow curl / same-origin
    if (!isProd) return cb(null, true);            // dev: allow all
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Origin not allowed by CORS: ' + origin));
  },
  credentials: true,
  exposedHeaders: ['Content-Range', 'X-Total-Count']
}));

// static + body parsers
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// sessions (kept optional for same-origin usage)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24*60*60*1000,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax'
  }
}));

// simple request logger (dev)
app.use((req, res, next) => {
  if (!isProd) {
    try {
      console.log(`[REQ] ${req.method} ${req.path} sessionUser=${req.session && req.session.userId}`);
      if (['POST','PUT','DELETE'].includes(req.method) && req.path.startsWith('/api/')) {
        console.log('  body preview:', JSON.stringify(req.body).slice(0, 800));
      }
    } catch(e){}
  }
  next();
});


/* ----------------- AUTH: JWT helpers & middleware ----------------- */

function generateToken(user) {
  const payload = { id: user.id, username: user.username };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

function verifyToken(token) {
  try { return jwt.verify(token, JWT_SECRET); } catch (e) { return null; }
}

// requireLogin supports session OR Bearer token (JWT)
function requireLogin(req, res, next) {
  // session-based
  if (req.session && req.session.userId) return next();

  // Bearer token
  const auth = (req.headers.authorization || '').trim();
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim();
    const payload = verifyToken(token);
    if (payload) {
      req.user = payload;
      return next();
    }
  }

  return res.status(401).json({ error: 'Authentication required' });
}

/* ----------------- Nodemailer transporter (optional) ----------------- */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '',
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
});

/* ----------------- Multer (uploads) ----------------- */
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (/^(image|video)\//.test(file.mimetype)) return cb(null, true);
    return cb(new Error('Only image/video types are allowed'));
  }
});

/* ----------------- AUTH ROUTES ----------------- */

// JWT-aware login: returns token and sets session (optional compatibility)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'username & password required' });

    const user = await DB.findUserByUsername(username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await DB.verifyPassword(user, password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // create jwt token
    const token = generateToken(user);

    // optional: set session for same-origin compatibility
    req.session.userId = user.id;

    return res.json({ ok: true, user: { id: user.id, username: user.username }, token });
  } catch (e) {
    console.error('Login error', e);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// logout keeps compatibility (destroys session)
app.post('/api/logout', (req, res) => {
  req.session && req.session.destroy(() => {});
  return res.json({ ok: true });
});

// me endpoint: supports session or token
app.get('/api/me', (req, res) => {
  if (req.session && req.session.userId) return res.json({ ok: true, userId: req.session.userId });
  const auth = (req.headers.authorization || '').trim();
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim();
    const payload = verifyToken(token);
    if (payload) return res.json({ ok: true, user: payload });
  }
  return res.status(401).json({ error: 'Not authenticated' });
});

/* ----------------- UPLOAD ----------------- */
app.post('/api/upload', requireLogin, upload.array('files'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    console.log('[UPLOAD] user', (req.session && req.session.userId) || (req.user && req.user.username), 'uploaded', urls);
    return res.json({ ok: true, urls });
  } catch (e) {
    console.error('Upload error', e);
    return res.status(500).json({ error: 'Upload failed', detail: String(e && e.message ? e.message : e) });
  }
});

/* ----------------- ACTUALITES CRUD ----------------- */
app.post('/api/actualites', requireLogin, async (req, res) => {
  try {
    const { title, summary, date, type, content, mainImage, medias } = req.body || {};
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title required' });

    let mediaArray = [];
    if (Array.isArray(medias)) mediaArray = medias;
    else if (typeof medias === 'string' && medias.trim()) {
      try { mediaArray = JSON.parse(medias); } catch { mediaArray = medias.split(/[\n,]+/).map(s => s.trim()).filter(Boolean); }
    }

    const actu = {
      id: DB.generateId(),
      title: title.trim(),
      summary: summary || '',
      date: date || new Date().toISOString().slice(0,10),
      type: type || 'actualite',
      slug: (title || '').toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g,''),
      content: content || '',
      mainImage: mainImage || '',
      medias: mediaArray,
      createdAt: new Date().toISOString()
    };

    console.log('[ACTU CREATE] user=', (req.session && req.session.userId) || (req.user && req.user.username), 'saving', { title: actu.title, id: actu.id });
    await DB.saveActualiteAndLimit(actu, 1000);
    return res.status(201).json({ ok: true, actualite: actu });
  } catch (e) {
    console.error('Create actualite error', e);
    return res.status(500).json({ error: 'Creation failed', detail: String(e && e.message ? e.message : e) });
  }
});

app.get('/api/actualites', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    const rows = await DB.getActualites(limit);
    return res.json({ ok: true, actualites: rows });
  } catch (e) {
    console.error('Get actualites error', e);
    return res.status(500).json({ error: 'Failed to fetch actualites' });
  }
});

app.put('/api/actualites/:id', requireLogin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'ID required' });
    const updated = await DB.updateActualite(id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Actualite not found' });
    console.log('[ACTU UPDATE] user=', (req.session && req.session.userId) || (req.user && req.user.username), 'updated', id);
    return res.json({ ok: true, actualite: updated });
  } catch (e) {
    console.error('Update actualite error', e);
    return res.status(500).json({ error: 'Update failed', detail: String(e && e.message ? e.message : e) });
  }
});

app.delete('/api/actualites/:id', requireLogin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'ID required' });
    const ok = await DB.deleteActualite(id);
    if (!ok) return res.status(404).json({ error: 'Actualite not found' });
    console.log('[ACTU DELETE] user=', (req.session && req.session.userId) || (req.user && req.user.username), 'deleted', id);
    return res.json({ ok: true });
  } catch (e) {
    console.error('Delete actualite error', e);
    return res.status(500).json({ error: 'Delete failed', detail: String(e && e.message ? e.message : e) });
  }
});

/* ----------------- PASSWORD RESET ----------------- */
app.post('/api/forgot-password', async (req, res) => {
  try {
    const { username } = req.body || {};
    if (!username) return res.status(400).json({ error: 'username required' });
    const rv = await DB.setResetTokenForUser(username);
    if (!rv) return res.status(404).json({ error: 'User not found' });

    const resetUrl = `${BASE_URL.replace(/\/$/,'')}/reset-password.html?token=${encodeURIComponent(rv.token)}&u=${encodeURIComponent(username)}`;
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'no-reply@localhost',
      to: username,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Réinitialisez votre mot de passe: ${resetUrl}`,
      html: `<p>Cliquez: <a href="${resetUrl}">Réinitialiser le mot de passe</a></p>`
    };

    let mailSent = false;
    try {
      if (transporter && transporter.sendMail) {
        await transporter.sendMail(mailOptions);
        mailSent = true;
      }
    } catch (mailErr) {
      console.error('Mail send error', mailErr);
      mailSent = false;
    }
    console.log('[FORGOT PW] token generated mailSent=', mailSent);
    return res.json({ ok: true, mailSent });
  } catch (e) {
    console.error('forgot-password error', e);
    return res.status(500).json({ error: 'Failed to generate reset token' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body || {};
    if (!token || !password) return res.status(400).json({ error: 'token and new password required' });
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash(password, 10);
    const rv = await DB.resetPasswordWithToken(token, hashed);
    if (!rv) return res.status(400).json({ error: 'Invalid or expired token' });
    console.log('[RESET PW] password reset for user=', rv.username);
    return res.json({ ok: true });
  } catch (e) {
    console.error('reset-password error', e);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

/* ----------------- Serve specific pages (optional) ----------------- */
app.get('/login.html', (req,res)=>res.sendFile(path.join(__dirname,'public','login.html')));
app.get('/admin.html', (req,res)=>res.sendFile(path.join(__dirname,'public','admin.html')));
app.get('/', (req,res)=>res.sendFile(path.join(__dirname,'public','login.html')));

// Ajoutez cette route dans server.js
app.post('/api/secteurs', (req, res) => {
  try {
    const body = req.body;
    
    if (!body || !body.slug) {
      return res.status(400).json({ error: 'slug requis' });
    }

    const data = readData();
    if (!data.secteurs) data.secteurs = {};
    
    // Enregistrer le secteur complet
    data.secteurs[body.slug] = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    writeData(data);
    
    console.log('✅ Secteur publié:', body.slug);
    
    // Mettre à jour également les données pour l'affichage sur offre de formation
    updateSectorsForDisplay(body);
    
    res.json({ ok: true, slug: body.slug });
    
  } catch (e) {
    console.error('❌ Erreur:', e);
    res.status(500).json({ error: 'secteur non enregistré' });
  }
});

// Fonction pour mettre à jour l'affichage sur offre de formation
function updateSectorsForDisplay(secteur) {
  try {
    const displayData = readData();
    
    if (!displayData.sectorsDisplay) {
      displayData.sectorsDisplay = {};
    }
    
    // Format pour l'affichage sur offre de formation
    displayData.sectorsDisplay[secteur.slug] = {
      titre: secteur.exterieur?.titre || secteur.title,
      image: secteur.exterieur?.image || secteur.heroImage,
      resume: secteur.exterieur?.resume || 
              (secteur.presentation && secteur.presentation[0]) || 
              `Découvrez le secteur ${secteur.title}`,
      slug: secteur.slug,
      filieresCount: secteur.filieresCount || "1"
    };
    
    writeData(displayData);
    console.log('📊 Données d\'affichage mises à jour pour:', secteur.slug);
    
  } catch (e) {
    console.error('❌ Erreur mise à jour affichage:', e);
  }
}
// REMPLACEZ CE BLOC :
app.get('/api/secteurs-display', (req, res) => {
  // Votre code actuel qui cause l'erreur
});

// PAR CE BLOC :
app.get('/api/secteurs-display', (req, res) => {
  try {
    // Chemin du fichier secteurs.json
    const filePath = path.join(__dirname, 'secteurs.json');
    
    // Lire le fichier de manière synchrone (plus simple)
    let data = {};
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(fileContent);
    } catch (error) {
      // Si le fichier n'existe pas, créer un objet vide
      console.log('Création du fichier secteurs.json...');
      fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
    }
    
    res.json(data);
  } catch (error) {
    console.error('Erreur secteurs-display:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
/* ----------------- Start server ----------------- */
(async () => {
  try {
    await DB.init();
    const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));
    server.on('error', err => {
      if (err && err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} in use, trying ${PORT+1}`);
        app.listen(PORT+1, () => console.log(`Server running on ${PORT+1}`));
      } else console.error('Server error', err);
    });
  } catch (e) {
    console.error('Fatal start error', e);
    process.exit(1);
  }
})();

