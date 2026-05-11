/* ============================================================================
   USER STORE — Profil utilisateur persistant (localStorage)
   Comptes chargés depuis users.csv (éditable dans Excel)
   ========================================================================== */
import usersCSV from './users.csv?raw';

/* --- Parse CSV → tableau d'objets --- */
function parseCSV(csv) {
  const lines = csv.trim().split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

export const USERS = parseCSV(usersCSV);

export function checkLogin(login, password) {
  return USERS.find(
    u => u.login.toLowerCase() === login.toLowerCase().trim()
      && u.password === password.trim()
  ) || null;
}

const KEY = 'logimatiq_user_v1';

export function getUser() {
  try { return JSON.parse(localStorage.getItem(KEY)); }
  catch { return null; }
}

export function saveUser(data) {
  const existing = getUser();
  const user = {
    id: existing?.id || crypto.randomUUID(),
    companyName: data.companyName.trim(),
    staffName:   data.staffName.trim(),
    role:        data.role,
    createdAt:   existing?.createdAt || new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify(user));
  return user;
}

export function clearUser() {
  localStorage.removeItem(KEY);
}

export const ROLES = [
  { id: 'client',          label: 'Client',               desc: 'Utilisateur de la machine',           color: '#0F4C81' },
  { id: 'tech_reseller',   label: 'Technicien revendeur', desc: 'Technicien d\'un distributeur',        color: '#059669' },
  { id: 'tech_logimatiq',  label: 'Technicien Logimatiq', desc: 'Équipe technique interne Logimatiq',  color: '#D97706' },
];

export function getRoleLabel(id) {
  return ROLES.find(r => r.id === id)?.label || id;
}
