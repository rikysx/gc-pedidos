"use strict";
const crypto=require("crypto");
const secret=()=>{const s=process.env.SESSION_SECRET;if(s&&s.length>=16)return s;
 if(process.env.VERCEL)throw new Error("Falta la variable SESSION_SECRET (mínimo 16 caracteres).");return"clave-solo-para-pruebas-locales"};
const b64=b=>Buffer.from(b).toString("base64url");
function sign(data,horas=12){const p=b64(JSON.stringify({...data,exp:Date.now()+horas*3600e3}));
 return p+"."+crypto.createHmac("sha256",secret()).update(p).digest("base64url")}
function verify(tok){if(typeof tok!=="string"||!tok.includes("."))return null;const[p,s]=tok.split(".");
 const ok=crypto.createHmac("sha256",secret()).update(p).digest("base64url");
 if(s.length!==ok.length||!crypto.timingSafeEqual(Buffer.from(s),Buffer.from(ok)))return null;
 try{const d=JSON.parse(Buffer.from(p,"base64url").toString());return d.exp>Date.now()?d:null}catch(e){return null}}
function hashClave(c){const salt=crypto.randomBytes(16).toString("hex");return"s1$"+salt+"$"+crypto.scryptSync(String(c),salt,32).toString("hex")}
function checkClave(c,stored){try{const[,salt,h]=String(stored).split("$");const x=crypto.scryptSync(String(c),salt,32);return crypto.timingSafeEqual(x,Buffer.from(h,"hex"))}catch(e){return false}}
function dv(b){let s=0,m=2;for(const d of String(b).split("").reverse()){s+=d*m;m=m==7?2:m+1}const r=11-s%11;return r==11?"0":r==10?"K":""+r}
// Devuelve el RUT sin puntos ni dígito verificador (ej. "11111111") o null si no es válido.
function parseRut(txt){const c=String(txt||"").replace(/[.\-\s]/g,"").toUpperCase();if(!/^\d{6,9}[\dK]$/.test(c))return null;
 const b=c.slice(0,-1);return dv(b)===c.slice(-1)?b:null}
const rutFmt=b=>b.replace(/\B(?=(\d{3})+(?!\d))/g,".")+"-"+dv(b);
module.exports={sign,verify,hashClave,checkClave,parseRut,rutFmt};
