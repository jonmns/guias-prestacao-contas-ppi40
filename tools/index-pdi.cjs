/* Índice didático da plataforma; utilizado pelo gerador Python. */
const fs=require('fs'),path=require('path'),vm=require('vm');const root=path.resolve(__dirname,'..');const ctx={};ctx.window=ctx;vm.createContext(ctx);for(const name of ['glossario','aulas','aulas-2','aulas-3','extras'])vm.runInContext(fs.readFileSync(path.join(root,'guias/pdi/data/'+name+'.js'),'utf8'),ctx);
const leaves=x=>typeof x==='string'?x:Array.isArray(x)?x.map(leaves).join(' '):x&&typeof x==='object'?Object.values(x).map(leaves).join(' '):'';
process.stdout.write(JSON.stringify(ctx.PDI.aulas.map(a=>({m:'normativa',s:a.id,t:a.titulo||a.title||a.id,p:'Aprender PD&I · Módulo '+a.mod,c:7,g:[],x:leaves(a).replace(/<[^>]+>/g,' ').slice(0,6000),u:'guias/base-normativa-pdi.html#/aula/'+a.id}))));
