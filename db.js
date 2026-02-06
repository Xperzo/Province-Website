// db.js
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

require('dotenv').config();

// Use writable directory: environment variable, or /tmp on containerized platforms, or app directory
const DATA_DIR = process.env.DATA_DIR || (process.env.NODE_ENV === 'production' ? '/tmp' : __dirname);

// Separate files: actualites (can be pushed to GitHub) and users (private, git-ignored)
const ACTUALITES_FILE = path.join(__dirname, 'actualites.json');  // In project dir, can be pushed
const USERS_FILE = path.join(DATA_DIR, 'users.json');  // In writable dir, git-ignored
const USERS_TMP_FILE = path.join(DATA_DIR, 'users.json.tmp');

// Legacy support - old data.json location
const LEGACY_DATA_FILE = path.join(DATA_DIR, 'data.json');

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

async function fileExists(p){ try { await fs.access(p); return true; } catch(e){ return false; } }

// Read actualites from separate file (or legacy data.json)
async function readActualites(){
  try {
    // First check if we have the new separate file
    if (await fileExists(ACTUALITES_FILE)) {
      const txt = await fs.readFile(ACTUALITES_FILE, 'utf8');
      const data = txt ? JSON.parse(txt) : { actualites: [] };
      return Array.isArray(data.actualites) ? data.actualites : [];
    }
    // Fallback to legacy data.json
    if (await fileExists(LEGACY_DATA_FILE)) {
      const txt = await fs.readFile(LEGACY_DATA_FILE, 'utf8');
      const data = txt ? JSON.parse(txt) : { actualites: [] };
      return Array.isArray(data.actualites) ? data.actualites : [];
    }
    return [];
  } catch (e) {
    console.error('readActualites error', e);
    return [];
  }
}

// Write actualites to separate file (in project dir, can be pushed)
async function writeActualites(actualites){
  try {
    const txt = JSON.stringify({ actualites }, null, 2);
    const tmpFile = ACTUALITES_FILE + '.tmp';
    await fs.writeFile(tmpFile, txt, 'utf8');
    await fs.rename(tmpFile, ACTUALITES_FILE);
    return true;
  } catch (e) {
    console.error('writeActualites error', e);
    throw e;
  }
}

// Read users from separate file (private, in writable dir)
async function readUsers(){
  try {
    if (await fileExists(USERS_FILE)) {
      const txt = await fs.readFile(USERS_FILE, 'utf8');
      const data = txt ? JSON.parse(txt) : { users: [] };
      return Array.isArray(data.users) ? data.users : [];
    }
    // Fallback to legacy data.json
    if (await fileExists(LEGACY_DATA_FILE)) {
      const txt = await fs.readFile(LEGACY_DATA_FILE, 'utf8');
      const data = txt ? JSON.parse(txt) : { users: [] };
      return Array.isArray(data.users) ? data.users : [];
    }
    return [];
  } catch (e) {
    console.error('readUsers error', e);
    return [];
  }
}

// Write users to separate file (private)
async function writeUsers(users){
  try {
    const txt = JSON.stringify({ users }, null, 2);
    await fs.writeFile(USERS_TMP_FILE, txt, 'utf8');
    await fs.rename(USERS_TMP_FILE, USERS_FILE);
    return true;
  } catch (e) {
    console.error('writeUsers error', e);
    throw e;
  }
}

// Legacy support
async function readData(){
  const actualites = await readActualites();
  const users = await readUsers();
  return { actualites, users };
}

async function writeData(data){
  await writeActualites(data.actualites || []);
  await writeUsers(data.users || []);
  return true;
}

function generateId(){ return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`; }

async function hashPassword(password){ const salt = await bcrypt.genSalt(10); return bcrypt.hash(password, salt); }

async function init(){
  try {
    // Check if we need to migrate from legacy data.json
    const legacyExists = await fileExists(LEGACY_DATA_FILE);
    const actualitesExists = await fileExists(ACTUALITES_FILE);
    const usersExists = await fileExists(USERS_FILE);
    
    if (legacyExists && (!actualitesExists || !usersExists)) {
      // Migrate from legacy format
      console.log('DB init: migrating from legacy data.json to separate files...');
      const txt = await fs.readFile(LEGACY_DATA_FILE, 'utf8');
      const data = txt ? JSON.parse(txt) : { actualites: [], users: [] };
      await writeActualites(data.actualites || []);
      await writeUsers(data.users || []);
      console.log('DB init: migration complete');
    }
    
    // Initialize users file if doesn't exist
    if (!await fileExists(USERS_FILE)) {
      const users = [{ id: generateId(), username: 'admin', password: await hashPassword(DEFAULT_PASSWORD) }];
      await writeUsers(users);
      console.log('DB init: users.json created with admin user');
    } else {
      // Check for legacy passwords and hash them
      const users = await readUsers();
      let updated = false;
      for (let u of users) {
        if (u.password && !u.password.startsWith('$2')) {
          u.password = await hashPassword(u.password);
          updated = true;
        }
      }
      if (updated) {
        await writeUsers(users);
        console.log('DB init: hashed legacy plaintext passwords');
      }
    }
    
    // Initialize actualites file if doesn't exist
    if (!await fileExists(ACTUALITES_FILE)) {
      await writeActualites([]);
      console.log('DB init: actualites.json created');
    }
    
    console.log('DB init: OK');
  } catch (e) {
    console.error('DB init error', e);
    throw e;
  }
}

async function getActualites(limit = 6){
  const data = await readData();
  const list = Array.isArray(data.actualites) ? data.actualites.slice().reverse() : [];
  if (limit && Number(limit) > 0) return list.slice(0, Number(limit));
  return list;
}

async function saveActualiteAndLimit(actu, limit = 6){
  const data = await readData();
  if (!Array.isArray(data.actualites)) data.actualites = [];
  data.actualites.push(actu);
  if (limit && Number(limit) > 0) {
    const start = Math.max(0, data.actualites.length - Number(limit));
    data.actualites = data.actualites.slice(start);
  }
  await writeData(data);
  return true;
}

async function updateActualite(id, payload){
  const data = await readData();
  if (!Array.isArray(data.actualites)) data.actualites = [];
  const idx = data.actualites.findIndex(a => String(a.id) === String(id));
  if (idx === -1) return null;
  const existing = data.actualites[idx];
  const updated = Object.assign({}, existing, payload, { updatedAt: new Date().toISOString() });
  data.actualites[idx] = updated;
  await writeData(data);
  return updated;
}

async function deleteActualite(id){
  const data = await readData();
  if (!Array.isArray(data.actualites)) data.actualites = [];
  const idx = data.actualites.findIndex(a => String(a.id) === String(id));
  if (idx === -1) return false;
  data.actualites.splice(idx, 1);
  await writeData(data);
  return true;
}

/* Users & auth helpers */
async function findUserByUsername(username){
  const data = await readData();
  if (!Array.isArray(data.users)) data.users = [];
  return data.users.find(u => String(u.username).toLowerCase() === String(username).toLowerCase());
}

async function verifyPassword(user, password){
  if (!user) return false;
  if (!user.password) return false;
  if (user.password.startsWith('$2')) {
    return bcrypt.compare(password, user.password);
  }
  return user.password === password;
}

async function setResetTokenForUser(username){
  const data = await readData();
  if (!Array.isArray(data.users)) data.users = [];
  const user = data.users.find(u => String(u.username).toLowerCase() === String(username).toLowerCase());
  if (!user) return null;
  const token = crypto.randomBytes(20).toString('hex');
  const expires = Date.now() + (60 * 60 * 1000); // 1 hour
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  user.resetTokenHash = tokenHash;
  user.resetExpires = expires;
  await writeData(data);
  return { token, expires, userId: user.id };
}

async function verifyResetToken(token){
  if (!token) return null;
  const data = await readData();
  if (!Array.isArray(data.users)) data.users = [];
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const user = data.users.find(u => u.resetTokenHash === tokenHash && u.resetExpires && Date.now() < u.resetExpires);
  return user || null;
}

async function resetPasswordWithToken(token, newPasswordHashed){
  const data = await readData();
  if (!Array.isArray(data.users)) data.users = [];
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const idx = data.users.findIndex(u => u.resetTokenHash === tokenHash && u.resetExpires && Date.now() < u.resetExpires);
  if (idx === -1) return null;
  data.users[idx].password = newPasswordHashed;
  delete data.users[idx].resetTokenHash;
  delete data.users[idx].resetExpires;
  await writeData(data);
  return { id: data.users[idx].id, username: data.users[idx].username };
}

async function getFirstUser(){
  const data = await readData();
  if (!Array.isArray(data.users)) return null;
  return data.users.length ? data.users[0] : null;
}

module.exports = {
  init,
  getActualites,
  saveActualiteAndLimit,
  updateActualite,
  deleteActualite,
  findUserByUsername,
  verifyPassword,
  generateId,
  setResetTokenForUser,
  verifyResetToken,
  resetPasswordWithToken,
  getFirstUser
};
