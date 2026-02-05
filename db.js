// db.js
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

require('dotenv').config();

const DATA_FILE = path.join(__dirname, 'data.json');
const TMP_FILE = path.join(__dirname, 'data.json.tmp');
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

async function fileExists(p){ try { await fs.access(p); return true; } catch(e){ return false; } }

async function readData(){
  try {
    if (!await fileExists(DATA_FILE)) return { actualites: [], users: [] };
    const txt = await fs.readFile(DATA_FILE, 'utf8');
    return txt ? JSON.parse(txt) : { actualites: [], users: [] };
  } catch (e) {
    console.error('readData error', e);
    throw e;
  }
}

async function writeData(data){
  try {
    const txt = JSON.stringify(data, null, 2);
    await fs.writeFile(TMP_FILE, txt, 'utf8');
    await fs.rename(TMP_FILE, DATA_FILE);
    return true;
  } catch (e) {
    console.error('writeData error', e);
    throw e;
  }
}

function generateId(){ return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`; }

async function hashPassword(password){ const salt = await bcrypt.genSalt(10); return bcrypt.hash(password, salt); }

async function init(){
  try {
    const exists = await fileExists(DATA_FILE);
    if (!exists) {
      const base = { actualites: [], users: [] };
      const pwd = DEFAULT_PASSWORD;
      const hashed = await hashPassword(pwd);
      base.users.push({ id: generateId(), username: 'admin', password: hashed });
      await writeData(base);
      console.log('DB init: data.json created with admin user (password from ADMIN_PASSWORD env or default)');
      return;
    }
    const data = await readData();
    if (!data || typeof data !== 'object') {
      const base = { actualites: [], users: [{ id: generateId(), username: 'admin', password: await hashPassword(DEFAULT_PASSWORD) }] };
      await writeData(base);
      console.log('DB init: corrupted data recreated with fresh admin user');
      return;
    }
    if (!Array.isArray(data.users)) data.users = [];
    if (data.users.length === 0) {
      data.users.push({ id: generateId(), username: 'admin', password: await hashPassword(DEFAULT_PASSWORD) });
      await writeData(data);
      console.log('DB init: added default admin user because users array was empty');
      return;
    }
    let updated = false;
    for (let u of data.users) {
      if (u.password && !u.password.startsWith('$2')) {
        u.password = await hashPassword(u.password);
        updated = true;
      }
    }
    if (updated) { await writeData(data); console.log('DB init: hashed legacy plaintext passwords'); }
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
