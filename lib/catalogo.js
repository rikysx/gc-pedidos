// Catálogo, precios y reglas de stock de Global Cristal. SOLO corre en el servidor (los precios no viajan al navegador).
// Fuente: CATALOGO GLOBAL 2026 — precios por cristal, sin IVA, en pesos chilenos.
"use strict";
const fmt=n=>(n>0?"+":"")+n.toFixed(2);
const nz=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim();
// STOCK Y PRECIOS según CATALOGO GLOBAL 2026 (precios por cristal, sin IVA).
// Cada celda del catálogo: E = solo esfera (E4 = "ESF 4/0"), C = combinada (C4/2 = "COM 4/2"), L = solo cilindro (L2 = "CIL 0/2").
// Un signo (+ o -) después significa que la celda es solo para ese lado; sin signo vale para ambos. @x = esfera máxima real de la celda.
const cells=s=>s.split(",").map(t=>{const[l,r]=t.split(":"),ty=l[0];let b=l.slice(1),sg="b";if(/[+-]$/.test(b)){sg=b.slice(-1);b=b.slice(0,-1)}
 const[pr,mx]=r.split("@"),[x,y]=b.split("/");let S=0,C=0;if(ty=="E")S=+x;else if(ty=="C"){S=+x;C=+y}else C=+x;
 return{S,C,sg,price:+pr,smax:mx?+mx:S}});
// P = [grosor/tipo, material, tipo, celdas, addMin, addMax, esfMínimaAbs, alias]
const P=[];const add=(f,t,n,c,o={})=>P.push([f,n,t,cells(c),o.a0||0,o.a1||0,o.min||0,o.alias||"",!!o.nc]);
const BI={a0:1,a1:3};
add("1.56","mono","NC","E4:750,E6:1000,E8-:1100,E8+:2500,C4/2:750,C6/2:1000,C8/2-:1100,C8/2+:2500,C2/4:1800,C4/4:1800,C6/4:2400,C8/4-:3000,C8/4+:4000,C2/6:2300,C4/6:2500,C6/6:3000,C8/6:6000,L2:750,L4:1800,L6:3000",{alias:"Blanco"});
add("1.56","mono","HMC","E4:1000,E6:1200,E8-:1800,E8+:2700,C4/2:1000,C6/2:1200,C8/2-:1800,C8/2+:2700,C10/2+:7000@8.5,C2/4:2200,C4/4:2200,C6/4:2600,C8/4-:3500,C8/4+:5000,C10/4+:8000@8.5,C2/6:2800,C4/6:3100,C6/6:3400,C8/6:6500,C2/7:12000,L2:1000,L4:2500,L6:3500,L7:12000");
add("1.56","mono","Bluecut","E4:1500,E6:2300,C4/2:1500,C6/2:2300,C2/4:3500,C4/4:3500,C6/4:3800,C2/6:5900,C4/6:5900,C6/6:5900,L2:1500,L4:3500,L6:5900");
add("1.56","mono","Foto Gris","E4:3000,E6:4000,C4/2:3000,C6/2:4000,C2/4:6000,C4/4:6000,C6/4:7000,C2/6:12000,C4/6:12000,L2:3000,L4:7000,L6:12000");
add("1.56","mono","Foto Café","E4:3000,E6:4000,C4/2:3000,C6/2:4000,C2/4:6000,C4/4:6000,C6/4:7000,L2:3000,L4:7000,L6:12000");
add("1.56","mono","Foto Púrpura","E4-:3500,C4/2-:3500,L2:3500");
add("1.56","mono","Foto Blue","E4:3500,C4/2:3500,L2:3500");
add("1.56","mono","Foto Gris filtro azul (azul)","E4:4000,E6:5000,C4/2:4000,C6/2:5000,C2/4:7500,C4/4:7500,C6/4:8000,C2/6:15000,C4/6:15000,C6/6:16000,L2:4000,L4:7500,L6:15000");
add("1.56","mono","Foto Gris filtro azul (verde)","E4:4000,E6:5000,C4/2:4000,C6/2:5000,C2/4:7500,C4/4:7500,L2:4000,L4:7500,L6:15000");
add("1.56","mono","Foto Café filtro azul","E4:5000,C4/2:5000,C2/4:7800,C4/4:7800,C2/6:16000,C4/6:16000,L2:5000,L4:7800,L6:16000");
add("1.56","mono","Ultra Thin","E8+:11000,E10+:14000,E12+:16000,C8/2+:11000,C10/2+:14000,C6/4-:13000,C8/4-:13000,C8/4+:15000,C10/4-:14000,C10/4+:16000,C6/6-:14000,C8/6-:15000,C9/6-:16000,C10/6-:16000");
add("1.59","mono","HMC","E4:2500,E6:2600,C4/2:2500,C6/2:2600,C2/4:6000,C4/4:6000,C6/4:7000,C2/6:8500,C4/6:8500,C6/6:8900,L2:2500,L4:6000,L6:8500");
add("1.59","mono","Bluecut","E4:4000,E6:4500,C4/2:4000,C6/2:4500,C2/4:6900,C4/4:6900,C6/4:7500,C2/6:9000,C4/6:9000,L2:4000,L4:6900,L6:9000");
add("1.59","mono","Foto Gris filtro azul","E4:10000,E6:13000,C4/2:10000,C6/2:13000,C2/4:14000,C4/4:14000,C6/4:16000,C2/6:20000,C4/6:20000,L2:10000,L4:14000,L6:20000");
add("1.61","mono","Bluecut","C2/6:12900,C4/6:12900,C6/6:12900,C2/7:20000,C4/7:20000,L6:12900,L7:20000");
add("1.61","mono","Clean Blue SHMC","E4:7000,E6:7000,C4/2:7000,C6/2:7000,C2/4:9200,C4/4:9200,C6/4:9200,L2:7000,L4:9200");
add("1.67","mono","HMC","E4:8000,E6:8000,E8-:9000,E8+:13500,E10-:10000,E10+:16500,E12-:11000,E14-:12000,E15-:14000,C4/2:8000,C6/2:8000,C8/2-:9000,C8/2+:13500,C10/2-:10000,C10/2+:16500,C12/2-:11000,C4/4-:12000,C4/4+:13000,C6/4-:12000,C6/4+:13000,C8/4-:14000,C8/4+:18500,C10/4-:15000,C10/4+:23000,C12/4-:22000,C2/6:20000,C4/6:20000,C6/6:20000,C8/6-:22000,C8/6+:25000,C9/6-:22000,L4:13000,L6:20000");
add("1.67","mono","Bluecut","E4-:9000,E4+:10000,E6-:9000,E6+:10000,E8-:10000,E8+:15000,E10-:11000,E12-:12000,E14-:13000,E15-:15000,C4/2-:9000,C4/2+:10000,C6/2-:9000,C6/2+:10000,C8/2-:10000,C8/2+:15000,C10/2-:12000,C12/2-:13000,C2/4:15000,C4/4:15000,C6/4:15000,C8/4-:16000,C8/4+:20000,C10/4-:17000,C2/6:23000,C4/6:23000,C6/6:23000,C8/6-:23000,L4:15000,L6:24000");
add("1.67","mono","Foto Gris","E4-:16000,E6-:16000,E6+:17000,E8-:17000,E8+:18000,E10-:18000,E12-:19000,C4/2-:16000,C6/2-:16000,C6/2+:17000,C8/2-:17000,C8/2+:18000,C10/2-:18000,C12/2-:19000,C4/4-:20000,C6/4-:21000,C6/4+:22000,C8/4-:22000,C8/4+:23000,C10/4-:23000");
add("1.67","mono","Doble ASP HMC","E20-:22000,E24-:25000,E25-:25000",{min:16,nc:1});
add("Bifocal","bif","NC","E3+:2600",BI);
add("Bifocal","bif","HMC","E3+:3000,E4+:9000,E2-:3500",BI);
add("Bifocal","bif","Bluecut","E3+:8000",BI);
add("Bifocal","bif","Foto Gris","E3+:10000,E2-:11000",BI);
add("Bifocal","bif","Foto Café","E3+:10000,E3.5+:18000",BI);
add("Bifocal invisible","prog","HMC","E3+:3000,E4+:9000",BI);
add("Bifocal invisible","prog","Bluecut","E3+:8000",BI);
add("Bifocal invisible","prog","Foto Gris","E3+:10000",BI);
add("Multifocal","prog","NC","E3+:6000,E4+:8500",BI);
add("Multifocal","prog","HMC","E3+:8500,E4+:15500,E2-:9000",BI);
add("Multifocal","prog","Bluecut","E3+:9800,E2-:11000",BI);
add("Multifocal","prog","Foto Gris","E3+:17000,E2-:19000",BI);
add("Multifocal","prog","Foto Café","E3+:17000,E3.5+:22000",BI);
add("Multifocal","prog","Foto Gris filtro azul","E3+:20000,E2-:21000",BI);
add("Lenticular","mono","1.56 HMC","E20-:13000,E25-:15000,E30-:18000",{min:20});
add("Lenticular","mono","1.61 ASP Blue","E20-:15000,E23-:19000",{min:20});
const EPS=1e-9;
// Busca la celda de stock que cubre la receta; devuelve {price} o {m: mensaje, f: campos a marcar}
// Cada categoría de cilindro cubre un tramo: 2 = hasta 2.00 (incluye sin cilindro) · 4 = 2.25 a 4.00 · 6 = 4.25 a 6.00 · 7 = 6.25 a 7.00
const CLO={0:0,2:0,4:2,6:4,7:6},cylTxt=C=>C==0?"sin cilindro":C==2?"hasta -2.00":`-${(CLO[C]+.25).toFixed(2)} a -${C.toFixed(2)}`;
const covC=(x,k)=>x.C==0?k<EPS:(x.C==2?k<=x.C+EPS:(k>CLO[x.C]+EPS&&k<=x.C+EPS));
function stock(p,s,c,nom){const cl=p[3],a=Math.abs(s),k=Math.abs(c),sg=s>0?"+":s<0?"-":"0",mn=p[6],okS=x=>sg=="0"||x.sg=="b"||x.sg==sg;
 if(mn&&a>0&&a<mn-EPS)return{f:["ls"],m:`la esfera ${fmt(s)} está fuera de nuestro stock de ${nom}: se trabaja desde ${fmt(-mn)} (en negativo).`};
 const wc=cl.filter(x=>covC(x,k)),cov=wc.filter(x=>okS(x)&&(a==0||(x.S>0&&x.smax>=a-EPS)));
 if(cov.length)return{price:Math.min(...cov.map(x=>x.price))};
 const Cs=[...new Set(cl.map(x=>x.C))].sort((x,y)=>x-y);
 if(!wc.length)return{f:["lc"],m:Cs.length==1&&Cs[0]==0?`${nom} no se trabaja con cilindro.`:`el cilindro ${fmt(c)} no está disponible en ${nom}. Cilindros disponibles: ${Cs.map(cylTxt).join(" · ")}.`};
 const ng=Math.max(0,...wc.filter(x=>x.sg!="+"&&x.S>0).map(x=>x.smax)),ps=Math.max(0,...wc.filter(x=>x.sg!="-"&&x.S>0).map(x=>x.smax)),Cb=Math.min(...wc.map(x=>x.C));
 if(!ng&&!ps)return{f:["ls","lc"],m:`con cilindro ${fmt(c)} en ${nom} solo se trabaja sin esfera (solo cilindro).`};
 return{f:k>0?["ls","lc"]:["ls"],m:`la esfera ${fmt(s)}${k>0?` con cilindro ${fmt(c)}`:" sin cilindro"} está fuera de nuestro stock de ${nom}. Para ${k>0?`cilindro ${cylTxt(Cb)}`:"esa receta"} hay esfera de ${ng?fmt(-ng):"0.00"} a ${ps?fmt(ps):"0.00"}.`}}

module.exports={P,stock,fmt,nz,EPS};
