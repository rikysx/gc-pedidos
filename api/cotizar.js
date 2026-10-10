"use strict";
const {quote}=require("../lib/cotizar");const {send,body,sesion}=require("../lib/http");
module.exports=async(req,res)=>{
 if(req.method!=="POST")return send(res,405,{error:"Método no permitido"});
 if(!sesion(req))return send(res,401,{error:"Tu sesión expiró. Ingresa nuevamente."});
 const b=await body(req);send(res,200,quote(b.rows))};
