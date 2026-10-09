/* Génère arbres-epimat.html (schémas Mermaid des arbres) directement depuis src/data/tree.js.
   Usage : node docs/arbres/gen.mjs   (depuis sav-app, ou depuis ce dossier) */
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DATA } from '../../src/data/tree.js';

const here = (f) => fileURLToPath(new URL(f, import.meta.url));
const N = DATA.nodes;
const q = (s) => String(s).replace(/"/g, '#quot;').replace(/</g, '#lt;').replace(/>/g, '#gt;');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const prefix = (id) => id.split('_')[0];
const targets = (n) => n.type === 'question' ? n.answers.map(a => [a.label, a.next]) : n.type === 'action' ? [[null, n.next]] : [];
const mediaFiles = (n) => (Array.isArray(n.media) ? n.media : n.media ? [n.media] : [])
  .flatMap(m => m.files || (m.file ? [m.file] : []));

/* Arbres = symptômes qui ont un point d'entrée réel */
const trees = Object.values(DATA.symptoms).flat().filter(s => s.rootNode !== 'tbd' && N[s.rootNode]);
const treeOf = Object.fromEntries(trees.map(s => [s.rootNode, s]));

function graph(root) {
  const p = prefix(root);
  const lines = ['flowchart TD'];
  const done = new Set(), queue = [root], seen = new Set();
  let c = 0;
  const leaf = (id) => { const nid = `${id}__${c++}`; lines.push(`  ${nid}(["${q(N[id].title)}"]):::${N[id].outcome}`); return nid; };
  const stub = (id) => { const nid = `${id}__${c++}`; lines.push(`  ${nid}[["→ ${q(treeOf[id]?.title || N[id].title)}"]]:::link`); return nid; };
  const target = (id) => N[id].type === 'solution' ? leaf(id) : prefix(id) !== p ? stub(id) : (queue.push(id), id);
  while (queue.length) {
    const id = queue.shift();
    if (done.has(id)) continue;
    done.add(id); seen.add(id);
    const n = N[id];
    lines.push(`  ${id}${n.type === 'question' ? `("${q(n.title)}")` : `["${q(n.title)}"]`}:::${n.type === 'question' ? 'ques' : 'act'}`);
    for (const [label, next] of targets(n)) {
      seen.add(next);
      lines.push(label === null ? `  ${id} --> ${target(next)}` : `  ${id} -->|"${q(label)}"| ${target(next)}`);
    }
  }
  lines.push(
    '  classDef ques fill:#E8EEFB,stroke:#3B5BA9,color:#16264D,stroke-width:1.5px',
    '  classDef act fill:#F3F4F6,stroke:#8A8F98,color:#22262C',
    '  classDef link fill:#EEF0FF,stroke:#5B5FC7,color:#22265E,stroke-dasharray:5 3',
    '  classDef resolved fill:#DDF2D8,stroke:#3E8A2E,color:#1D4A13,stroke-width:1.5px',
    '  classDef replace fill:#FBE0D8,stroke:#B5482A,color:#5E1F0E,stroke-width:1.5px',
    '  classDef sav fill:#FCEBC8,stroke:#B37A12,color:#563A05,stroke-width:1.5px',
    '  classDef info fill:#ECEBE6,stroke:#86847C,color:#3A3934',
  );
  const ids = [...done];
  const sols = new Set([...seen].filter(id => N[id]?.type === 'solution'));
  const photos = new Set(ids.concat([...sols]).flatMap(id => mediaFiles(N[id]))).size;
  const stats = `${ids.filter(id => N[id].type === 'question').length} questions · ${ids.filter(id => N[id].type === 'action').length} actions · ${sols.size} conclusions · ${photos} photos`;
  return { mermaid: lines.join('\n'), stats };
}

const tools = '<div class="tools"><button class="tool" data-z="-">−</button><span class="zoomv">100 %</span><button class="tool" data-z="+">+</button><button class="tool" data-z="0">Réinitialiser</button></div>';
const panels = trees.map(s => {
  const { mermaid, stats } = graph(s.rootNode);
  return `  <section class="panel" id="p-${prefix(s.rootNode)}">
    <div class="bar"><h2>${esc(s.title)} <span class="sub mono">· ${stats}</span></h2>
      ${tools}</div>
    <div class="scroll"><pre class="mermaid">
${mermaid}
    </pre></div>
  </section>`;
}).join('\n\n');
const nav = trees.map(s => `<a href="#p-${prefix(s.rootNode)}">${esc(s.category)}</a>`).join('');
const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

const html = fs.readFileSync(here('./template.html'), 'utf8')
  .replace('%%NAV%%', nav).replace('%%PANELS%%', panels).replaceAll('%%DATE%%', date);
fs.writeFileSync(here('./arbres-epimat.html'), html);
console.log(`arbres-epimat.html : ${trees.length} arbres`);
