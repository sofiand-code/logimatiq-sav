/* ============================================================================
   STATS — Tableau de bord statistiques
   ========================================================================== */
import { loadHistory } from '../components/history-store.js';
import { getMachines } from '../data/machines-store.js';
import { getUser, getRoleLabel } from '../data/user-store.js';
import { findSymptom } from './home.js';
import { t } from '../i18n.js';

export function renderStats() {
  const history  = loadHistory();
  const machines = getMachines();
  const user     = getUser();
  const container = document.getElementById('stats-body');
  if (!container) return;

  if (!history.length && !machines.length) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-3xl bg-white border border-slate-200 shadow-sm
                    flex items-center justify-center mb-4">
          <svg viewBox="0 0 24 24" class="w-7 h-7 text-slate-300" fill="none"
               stroke="currentColor" stroke-width="1.8">
            <path stroke-linecap="round" d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/>
          </svg>
        </div>
        <p class="font-bold text-slate-500 text-sm">${t('Aucune donnée disponible')}</p>
        <p class="text-xs text-slate-400 mt-1">${t('Effectuez des diagnostics pour voir les statistiques')}</p>
      </div>`;
    return;
  }

  /* ---- Calculs ---- */
  const total    = history.length;
  const resolved = history.filter(h => h.outcome === 'resolved').length;
  const sav      = history.filter(h => h.outcome === 'sav').length;
  const part     = history.filter(h => h.outcome === 'part').length;
  const rate     = total ? Math.round((resolved / total) * 100) : 0;

  /* Par machine (numéro de série) */
  const bySerial = {};
  history.forEach(h => {
    const key = h.machineSerial || '—';
    if (!bySerial[key]) bySerial[key] = { serial: key, clientName: h.clientName || '—', total: 0, sav: 0, model: h.machineModelLabel || h.machineId || '—' };
    bySerial[key].total++;
    if (h.outcome === 'sav') bySerial[key].sav++;
  });
  const topMachines = Object.values(bySerial)
    .sort((a, b) => b.total - a.total).slice(0, 5);

  /* Par société */
  const byCompany = {};
  history.forEach(h => {
    const key = h.companyName || '—';
    if (!byCompany[key]) byCompany[key] = { name: key, total: 0, sav: 0 };
    byCompany[key].total++;
    if (h.outcome === 'sav') byCompany[key].sav++;
  });
  const topCompanies = Object.values(byCompany)
    .sort((a, b) => b.total - a.total).slice(0, 5);

  /* Par symptôme (pannes les plus fréquentes) */
  const bySymptom = {};
  history.forEach(h => {
    const sym = findSymptom(h.symptomId);
    const key = sym?.title || h.symptomId;
    if (!bySymptom[key]) bySymptom[key] = { title: key, count: 0 };
    bySymptom[key].count++;
  });
  const topSymptoms = Object.values(bySymptom)
    .sort((a, b) => b.count - a.count).slice(0, 5);

  /* ---- Rendu ---- */
  container.innerHTML = `

    <!-- KPIs -->
    <div class="grid grid-cols-3 gap-2 mb-5">
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm text-center">
        <div class="text-2xl font-black text-slate-900">${total}</div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">${t('Diagnostics')}</div>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm text-center">
        <div class="text-2xl font-black text-emerald-500">${rate}%</div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">${t('Résolus')}</div>
      </div>
      <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm text-center">
        <div class="text-2xl font-black text-brand-600">${machines.length}</div>
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">${t('Machines')}</div>
      </div>
    </div>

    <!-- Résultats détaillés -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-5">
      <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">${t('Répartition des résultats')}</p>
      ${outcomeBar(t('Résolu'), resolved, total, '#10B981')}
      ${outcomeBar(t('SAV requis'), sav, total, '#DC2626')}
      ${outcomeBar(t('Pièce à changer'), part, total, '#F59E0B')}
    </div>

    <!-- Machines les + actives -->
    ${topMachines.length ? `
    <div class="mb-5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
        ${t('Machines les plus actives')}
      </h3>
      <div class="space-y-2">
        ${topMachines.map((m, i) => `
          <div class="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center gap-3">
            <span class="w-7 h-7 rounded-xl text-white text-xs font-black flex items-center justify-center shrink-0"
                  style="background:${i === 0 ? '#0F4C81' : '#94A3B8'}">${i + 1}</span>
            <div class="flex-1 min-w-0">
              <div class="font-black text-slate-900 text-sm">${m.serial}</div>
              <div class="text-[11px] text-slate-400">${m.model} · ${m.clientName}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="text-sm font-black text-slate-900">${m.total}</div>
              <div class="text-[10px] text-slate-400">${m.sav > 0 ? `${m.sav} ${t('SAV')}` : 'OK'}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- Sociétés les + actives -->
    ${(user?.role !== 'client' && topCompanies.length > 1) ? `
    <div class="mb-5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
        ${t('Sociétés les plus actives')}
      </h3>
      <div class="space-y-2">
        ${topCompanies.map((c, i) => `
          <div class="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center gap-3">
            <span class="w-7 h-7 rounded-xl text-white text-xs font-black flex items-center justify-center shrink-0"
                  style="background:${i === 0 ? '#059669' : '#94A3B8'}">${i + 1}</span>
            <div class="flex-1 min-w-0">
              <div class="font-black text-slate-900 text-sm truncate">${c.name}</div>
              <div class="text-[11px] text-slate-400">${c.sav} ${t('SAV')} / ${c.total}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="text-sm font-black text-slate-900">${c.total}</div>
              <div class="text-[10px] ${c.sav > 0 ? 'text-rose-400' : 'text-slate-400'}">${
                c.sav > 0 ? `${c.sav} ${t('SAV')}` : '✓ OK'
              }</div>
            </div>
          </div>`).join('')}
      </div>
    </div>` : ''}

    <!-- Pannes les plus fréquentes -->
    ${topSymptoms.length ? `
    <div class="mb-5">
      <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">
        ${t('Pannes les plus fréquentes')}
      </h3>
      <div class="space-y-2">
        ${topSymptoms.map((s, i) => `
          <div class="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm flex items-center gap-3">
            <span class="w-6 h-6 rounded-lg text-white text-[10px] font-black flex items-center justify-center shrink-0"
                  style="background:${['#0F4C81','#1E6CB8','#2E7EC8','#4492D8','#5AA6E8'][i] || '#94A3B8'}">${i + 1}</span>
            <div class="flex-1 min-w-0 text-sm font-semibold text-slate-800 truncate">${s.title}</div>
            <span class="shrink-0 text-xs font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              ${s.count}×
            </span>
          </div>`).join('')}
      </div>
    </div>` : ''}
  `;
}

function outcomeBar(label, count, total, color) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return `
    <div class="mb-2.5">
      <div class="flex justify-between text-xs font-semibold text-slate-600 mb-1">
        <span>${label}</span>
        <span class="font-black" style="color:${color}">${count} (${pct}%)</span>
      </div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500"
             style="width:${pct}%;background:${color}"></div>
      </div>
    </div>`;
}
