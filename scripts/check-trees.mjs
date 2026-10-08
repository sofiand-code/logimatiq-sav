/* ============================================================================
   CHECK-TREES — contrôle des arbres de diagnostic (npm run check-trees)
   Usage : node scripts/check-trees.mjs [chemin vers l'app]
   Échoue (code 1) si :
   - un `next` (ou une réponse) pointe vers un nœud inexistant ;
   - un nœud n'est accessible depuis aucun point d'entrée (symptoms[].rootNode) ;
   - toutes les réponses d'une question mènent au même endroit ;
   - un nœud ou un symptôme n'a pas sa traduction EN (ou un nombre de
     réponses / d'étapes / de légendes différent du français) ;
   - une image citée dans `media` est absente de public/.
   ========================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const app = path.resolve(process.argv[2] || fileURLToPath(new URL('..', import.meta.url)));
const { DATA } = await import(pathToFileURL(path.join(app, 'src/data/tree.js')).href);
const { EN } = await import(pathToFileURL(path.join(app, 'src/locales/en.js')).href);

const nodes = DATA.nodes;
const errors = [];
const warnings = [];
const err = (rule, id, msg) => errors.push({ rule, id, msg });

/* 1. Liens cassés + forme des nœuds */
const targets = (n) => n.type === 'question' ? (n.answers || []).map(a => a.next)
                     : n.type === 'action' ? [n.next] : [];
for (const [id, n] of Object.entries(nodes)) {
  if (!['question', 'action', 'solution'].includes(n.type)) err('type', id, `type inconnu « ${n.type} »`);
  if (n.type === 'question' && (!n.answers || n.answers.length < 2)) err('forme', id, 'question avec moins de 2 réponses');
  if (n.type === 'action' && !n.next) err('forme', id, 'action sans `next`');
  if (n.type === 'action' && !(n.steps || []).length) err('forme', id, 'action sans étapes');
  if (n.type === 'solution' && n.next) err('forme', id, 'solution avec un `next`');
  for (const t of targets(n)) if (!nodes[t]) err('lien', id, `pointe vers « ${t} » qui n'existe pas`);
}

/* 2. Accessibilité depuis les points d'entrée */
const symptoms = Object.values(DATA.symptoms).flat();
const roots = symptoms.map(s => s.rootNode);
for (const s of symptoms)
  if (!nodes[s.rootNode]) err('lien', s.id, `rootNode « ${s.rootNode} » inexistant`);
const seen = new Set();
const stack = roots.filter(r => nodes[r]);
while (stack.length) {
  const id = stack.pop();
  if (seen.has(id)) continue;
  seen.add(id);
  for (const t of targets(nodes[id])) if (nodes[t] && !seen.has(t)) stack.push(t);
}
for (const id of Object.keys(nodes)) if (!seen.has(id)) err('inaccessible', id, 'aucun point d\'entrée ne mène à ce nœud');

/* 3. Questions dont toutes les réponses vont au même endroit */
for (const [id, n] of Object.entries(nodes))
  if (n.type === 'question' && n.answers?.length >= 2 && new Set(n.answers.map(a => a.next)).size === 1)
    err('question-inutile', id, `toutes les réponses mènent à « ${n.answers[0].next} »`);

/* 4. Traductions EN (index par index : un décalage mélangerait les langues) */
const mediaList = (n) => Array.isArray(n.media) ? n.media : n.media ? [n.media] : [];
for (const [id, n] of Object.entries(nodes)) {
  const e = EN.nodes?.[id];
  if (!e) { err('en', id, 'aucune entrée dans EN.nodes'); continue; }
  if (!e.title) err('en', id, 'title EN manquant');
  for (const f of ['help', 'message']) {
    if (n[f] && !e[f]) err('en', id, `${f} EN manquant`);
    if (!n[f] && e[f]) err('en', id, `${f} EN sans ${f} FR (texte EN périmé)`);
  }
  if (n.type === 'question' && (e.answers || []).length !== n.answers.length)
    err('en', id, `réponses EN : ${(e.answers || []).length} pour ${n.answers.length} en FR`);
  if (n.type === 'action' && (e.steps || []).length !== (n.steps || []).length)
    err('en', id, `étapes EN : ${(e.steps || []).length} pour ${(n.steps || []).length} en FR`);
  const media = mediaList(n);
  const enMedia = e.media === undefined ? [] : Array.isArray(e.media) ? e.media : [e.media];
  if (media.length !== enMedia.length || enMedia.some(l => !l))
    err('en', id, `légendes EN : ${enMedia.length} pour ${media.length} en FR`);
}
for (const s of symptoms)
  if (!EN.symptoms?.[s.id]) err('en', s.id, 'symptôme sans titre EN');
for (const id of Object.keys(EN.nodes || {}))
  if (!nodes[id]) warnings.push(`${id} : traduction EN d'un nœud qui n'existe plus`);

/* 5. Images présentes dans public/ */
for (const [id, n] of Object.entries(nodes))
  for (const m of mediaList(n))
    for (const f of m.files || (m.file ? [m.file] : []))
      if (!fs.existsSync(path.join(app, 'public', f))) err('image', id, `« public/${f} » introuvable`);

/* Rapport */
const by = errors.reduce((m, e) => ((m[e.rule] ||= []).push(e), m), {});
for (const [rule, list] of Object.entries(by)) {
  console.log(`\n✗ ${rule} (${list.length})`);
  for (const e of list) console.log(`  - ${e.id} : ${e.msg}`);
}
if (warnings.length) console.log(`\n⚠ avertissements (${warnings.length})\n  - ${warnings.join('\n  - ')}`);
console.log(errors.length
  ? `\n${errors.length} problème(s) — échec.`
  : `\nOK — ${Object.keys(nodes).length} nœuds, ${roots.length} points d'entrée.`);
process.exit(errors.length ? 1 : 0);
