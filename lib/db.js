// Acceso a datos. Con SUPABASE_URL y SUPABASE_SERVICE_KEY usa Supabase; sin ellas, en tu computador, usa clientes de prueba en memoria.
"use strict";
const {hashClave}=require("./auth");
const URL_=process.env.SUPABASE_URL,KEY=process.env.SUPABASE_SERVICE_KEY;
const real=!!(URL_&&KEY);
if(!real&&process.env.VERCEL&&process.env.GC_DEMO!=="1")console.error("Faltan SUPABASE_URL / SUPABASE_SERVICE_KEY: no se puede iniciar sesión.");
const H={apikey:KEY,Authorization:"Bearer "+KEY,"Content-Type":"application/json"};
let demo=null,seq=0;
function demoClientes(){if(!demo){const h=hashClave("1234");demo={"11111111":{rut:"11111111",nombre:"Óptica Vista Clara",clave_hash:h,activo:true},"12345678":{rut:"12345678",nombre:"Óptica Central Ltda.",clave_hash:h,activo:true},"76543210":{rut:"76543210",nombre:"Óptica Los Andes SpA",clave_hash:h,activo:true}}}return demo}
async function getCliente(rut){
 if(!real){if(process.env.VERCEL&&process.env.GC_DEMO!=="1")return null;return demoClientes()[rut]||null}
 const r=await fetch(`${URL_}/rest/v1/clientes?rut=eq.${encodeURIComponent(rut)}&select=rut,nombre,clave_hash,activo&limit=1`,{headers:H});
 if(!r.ok)throw new Error("Supabase clientes: "+r.status);const a=await r.json();return a[0]||null}
async function guardarPedido(p){
 if(!real){seq++;return{numero:"GC-"+String(seq).padStart(5,"0")}}
 const r=await fetch(`${URL_}/rest/v1/pedidos`,{method:"POST",headers:{...H,Prefer:"return=representation"},body:JSON.stringify(p)});
 if(!r.ok)throw new Error("Supabase pedidos: "+r.status+" "+await r.text());const a=await r.json();return{numero:a[0].numero}}
module.exports={getCliente,guardarPedido,real};
