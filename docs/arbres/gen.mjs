import fs from 'fs';
const N=JSON.parse(fs.readFileSync('nodes.json','utf8'));
const WARN=new Set(['b_port_com_result','s_eteint_multiprise','s_vert_distepi_result','s_vert_resolution_result']);
const q=s=>s.replace(/"/g,'#quot;').replace(/</g,'#lt;').replace(/>/g,'#gt;');
function graph(p){
  const lines=['flowchart TD'];let c=0;const done=new Set();
  const stack=[p+'_debut'];
  const leaf=id=>{const n=N[id];const nid=id+'__'+(c++);lines.push(`  ${nid}(["${q(n.x)}"]):::${n.o}`);return nid};
  const decl=id=>{const n=N[id];const shape=n.t==='q'?`("${q(n.x)}")`:`["${q(n.x)}"]`;lines.push(`  ${id}${shape}:::${WARN.has(id)?'warn':(n.t==='q'?'ques':'act')}`)};
  const target=id=>N[id].t==='s'?leaf(id):(stack.push(id),id);
  while(stack.length){const id=stack.shift();if(done.has(id))continue;done.add(id);decl(id);const n=N[id];
    if(n.t==='a')lines.push(`  ${id} --> ${target(n.n)}`);
    else n.a.forEach(([l,nx])=>lines.push(`  ${id} -->|"${q(l)}"| ${target(nx)}`));}
  lines.push('  classDef ques fill:#E8EEFB,stroke:#3B5BA9,color:#16264D,stroke-width:1.5px');
  lines.push('  classDef act fill:#F3F4F6,stroke:#8A8F98,color:#22262C');
  lines.push('  classDef warn fill:#FFF1D6,stroke:#C77700,color:#5A3500,stroke-width:2.5px,stroke-dasharray:6 3');
  lines.push('  classDef resolved fill:#DDF2D8,stroke:#3E8A2E,color:#1D4A13,stroke-width:1.5px');
  lines.push('  classDef replace fill:#FBE0D8,stroke:#B5482A,color:#5E1F0E,stroke-width:1.5px');
  lines.push('  classDef sav fill:#FCEBC8,stroke:#B37A12,color:#563A05,stroke-width:1.5px');
  lines.push('  classDef info fill:#ECEBE6,stroke:#86847C,color:#3A3934');
  return lines.join('\n');
}
const stats=p=>{const ids=Object.keys(N).filter(k=>k.startsWith(p+'_'));return {q:ids.filter(k=>N[k].t==='q').length,a:ids.filter(k=>N[k].t==='a').length}};
let html=fs.readFileSync('template.html','utf8');
for(const p of ['s','i','b']){html=html.replace(`%%G_${p}%%`,graph(p));const s=stats(p);html=html.replace(`%%S_${p}%%`,`${s.q} questions · ${s.a} actions`)}
fs.writeFileSync('arbres-epimat.html',html);
console.log('ok');
