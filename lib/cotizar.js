// Valida cada fila del pedido contra el stock y calcula los precios. Corre solo en el servidor.
"use strict";
const {P,stock,fmt,nz,EPS}=require("./catalogo");
const NOCYL="el cilindro no está disponible en este cristal (solo se trabaja con esfera).";
const num=v=>v===null||v===undefined||v===""||Number.isNaN(Number(v))?null:Number(v);

// r = {cant, tipo, grosor, material, ls, lc, cs, cc, ad}  (dioptrías ya como números; vacío = null)
function quoteRow(r){
 const errs=[],E=(m,...f)=>errs.push({m,f});
 const cant=parseInt(r.cant,10);if(!(cant>=1)||cant>999)E("la cantidad debe ser 1 o más.","q");
 const tipo=String(r.tipo||"");if(!tipo){E("elige el tipo.","t");return{errors:errs,lines:[]}}
 const fam=tipo=="Monofocal"?String(r.grosor||""):tipo;if(!fam){E("elige el grosor.","g");return{errors:errs,lines:[]}}
 const nm0=String(r.material||"").trim();
 const p=P.find(x=>x[0]==fam&&(nz(x[1])==nz(nm0)||(x[7]&&nz(x[7])==nz(nm0))));
 if(!p){const otros=[...new Set(P.filter(x=>nz(x[1])==nz(nm0)).map(x=>x[0]))];
  E(`"${nm0||"(vacío)"}" no está en nuestro stock de ${fam}.`+(nm0&&otros.length?` Ese material sí existe en: ${otros.join(", ")}.`:"")+` Materiales de ${fam}: ${P.filter(x=>x[0]==fam).map(x=>x[1]).join(", ")}.`,"m");return{errors:errs,lines:[]}}
 const t=p[2],a0=p[4],a1=p[5],nom=`${p[0]} ${p[1]}`,mono=t=="mono";
 const ls=num(r.ls),lc=num(r.lc),cs=num(r.cs),cc=num(r.cc),ad=num(r.ad);
 const hasL=!mono||ls!==null||lc!==null,hasC=mono&&(cs!==null||cc!==null);
 if(mono&&!hasL&&!hasC)E("ingresa la dioptría de lejos o la de cerca.","ls","cs");
 const noPos=(v,f,lab)=>{if(v!==null&&v>0){E(`${lab}: el cilindro va en negativo.`,f);return false}return true};
 const noCyl=(v,f)=>{if(p[8]&&v!==null&&v!==0){E(NOCYL.charAt(0).toUpperCase()+NOCYL.slice(1),f);return false}return true};
 let uL=null,uC=null;
 if(hasL){if(ls===null)E("Esfera lejos: falta completarlo.","ls");
  else if(noPos(lc,"lc","Cilindro lejos")&&noCyl(lc,"lc")){const s=stock(p,ls,lc||0,nom);if(s.m)E(`Lejos: ${s.m}`,...s.f);else uL=s.price}}
 if(!mono){if(ad===null)E("Add: falta completarlo.","ad");else if(ad<a0-EPS||ad>a1+EPS)E(`Add ${fmt(ad)} fuera de nuestro stock. Rango de add para ${nom}: ${fmt(a0)} a ${fmt(a1)}.`,"ad")}
 if(hasC){if(cs===null)E("Esfera cerca: falta completarlo.","cs");
  else if(noPos(cc,"cc","Cilindro cerca")&&noCyl(cc,"cc")){const s=stock(p,cs,cc||0,nom);if(s.m)E(`Cerca: ${s.m}`,...s.f.map(f=>f=="ls"?"cs":"cc"));else uC=s.price}}
 if(errs.length)return{errors:errs,lines:[]};
 const lines=[],L=(txt,cr,esf,cil,adv,unit,side)=>lines.push({cant,unit,txt,cr,esf,cil,ad:adv,side});
 if(mono){
  if(hasL)L(`${nom} ${fmt(ls)} ESF`+(lc?` ${fmt(lc)} CIL`:"")+" (Lejos)",`${nom} (Lejos)`,fmt(ls),lc?fmt(lc):"","",uL,"L");
  if(hasC)L(`${nom} ${fmt(cs)} ESF`+(cc?` ${fmt(cc)} CIL`:"")+" (Cerca)",`${nom} (Cerca)`,fmt(cs),cc?fmt(cc):"","",uC,"C");
 }else L(`${nom} ${fmt(ls)} ESF · Add ${fmt(ad)}`,nom,fmt(ls),"",fmt(ad),uL,"L");
 return{errors:[],lines};
}

function quote(rows){
 const out=[],lines=[];
 (Array.isArray(rows)?rows:[]).slice(0,60).forEach((r,i)=>{
  const q=quoteRow(r||{});out.push({i:r&&r.i!=null?r.i:i,errors:q.errors,lines:q.lines});
  q.lines.forEach(l=>lines.push({...l,row:r&&r.i!=null?r.i:i}))});
 const neto=lines.reduce((a,l)=>a+l.cant*l.unit,0),iva=Math.round(neto*0.19);
 return{rows:out,lines,neto,iva,total:neto+iva,cristales:lines.reduce((a,l)=>a+l.cant,0),ok:out.every(x=>!x.errors.length)&&lines.length>0};
}
// Lista de materiales para los desplegables del navegador (sin precios ni celdas de stock).
function catalogoPublico(){
 return P.map(p=>[p[0],p[1],p[2],p[4],p[5],p[6],p[7],!!p[8],p[3].length>0&&p[3].every(x=>x.sg=="-")]);
}
module.exports={quote,quoteRow,catalogoPublico};
