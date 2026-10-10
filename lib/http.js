"use strict";
const {verify}=require("./auth");
const send=(res,code,obj)=>{res.statusCode=code;res.setHeader("Content-Type","application/json; charset=utf-8");res.setHeader("Cache-Control","no-store");res.end(JSON.stringify(obj))};
async function body(req){if(req.body&&typeof req.body==="object")return req.body;
 if(typeof req.body==="string"){try{return JSON.parse(req.body)}catch(e){return{}}}
 return await new Promise(ok=>{let d="";req.on("data",c=>{d+=c;if(d.length>2e5)req.destroy()});req.on("end",()=>{try{ok(JSON.parse(d||"{}"))}catch(e){ok({})}});req.on("error",()=>ok({}))})}
const sesion=req=>{const h=req.headers.authorization||"";return verify(h.startsWith("Bearer ")?h.slice(7):"")};
module.exports={send,body,sesion};
