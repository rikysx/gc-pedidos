"use strict";
const {parseRut,checkClave,sign,rutFmt}=require("../lib/auth");const db=require("../lib/db");
const {catalogoPublico}=require("../lib/cotizar");const {send,body}=require("../lib/http");
const intentos=new Map(); // límite básico por IP (en memoria; se reinicia cuando el servidor "duerme")
const espera=ms=>new Promise(r=>setTimeout(r,ms));
module.exports=async(req,res)=>{
 if(req.method!=="POST")return send(res,405,{error:"Método no permitido"});
 const ip=String(req.headers["x-forwarded-for"]||req.socket.remoteAddress||"").split(",")[0].trim(),ahora=Date.now();
 const reg=(intentos.get(ip)||[]).filter(t=>ahora-t<10*60e3);
 if(reg.length>=8)return send(res,429,{error:"Demasiados intentos. Espera unos minutos y vuelve a probar."});
 const b=await body(req),rut=parseRut(b.rut);
 if(!rut)return send(res,400,{error:"El RUT no es válido. Revisa el dígito verificador."});
 let c=null;try{c=await db.getCliente(rut)}catch(e){console.error(e);return send(res,500,{error:"No pudimos validar tu ingreso. Intenta de nuevo en un momento."})}
 const ok=c&&c.activo!==false&&checkClave(b.clave,c.clave_hash);
 if(!ok){reg.push(ahora);intentos.set(ip,reg);await espera(500);return send(res,401,{error:"RUT o clave incorrectos, o la óptica aún no está registrada."})}
 intentos.delete(ip);
 send(res,200,{token:sign({rut:c.rut,nombre:c.nombre}),nombre:c.nombre,rut:rutFmt(c.rut),catalogo:catalogoPublico()})};
