"use strict";
const {quote}=require("../lib/cotizar");const db=require("../lib/db");const {send,body,sesion}=require("../lib/http");const {rutFmt}=require("../lib/auth");
module.exports=async(req,res)=>{
 if(req.method!=="POST")return send(res,405,{error:"Método no permitido"});
 const s=sesion(req);if(!s)return send(res,401,{error:"Tu sesión expiró. Ingresa nuevamente."});
 const b=await body(req),q=quote(b.rows),entrega=b.entrega;
 if(!["retiro","despacho"].includes(entrega))return send(res,400,{error:"Elige retiro en tienda o despacho."});
 if(!q.ok)return send(res,422,{error:"El pedido tiene filas por corregir.",...q});
 try{const g=await db.guardarPedido({rut:s.rut,cliente:s.nombre,entrega,filas:b.rows,lineas:q.lines,neto:q.neto,iva:q.iva,total:q.total,cristales:q.cristales});
  send(res,200,{numero:g.numero,cliente:{nombre:s.nombre,rut:rutFmt(s.rut)},...q})}
 catch(e){console.error(e);send(res,500,{error:"No pudimos registrar el pedido. Intenta de nuevo."})}};
