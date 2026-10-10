// Servidor local de pruebas:  node dev-server.js  →  http://localhost:3000
const http=require("http"),fs=require("fs"),path=require("path");
const types={".html":"text/html; charset=utf-8",".js":"text/javascript",".css":"text/css",".png":"image/png",".svg":"image/svg+xml"};
http.createServer(async(req,res)=>{
 const u=new URL(req.url,"http://x");
 if(u.pathname.startsWith("/api/")){const f=path.join(__dirname,"api",path.basename(u.pathname)+".js");
  if(!fs.existsSync(f)){res.statusCode=404;return res.end("{}")}
  try{await require(f)(req,res)}catch(e){console.error(e);res.statusCode=500;res.end(JSON.stringify({error:"Error interno"}))}return}
 const p=path.join(__dirname,"public",u.pathname==="/"?"index.html":path.normalize(u.pathname).replace(/^(\.\.[\/\\])+/,""));
 fs.readFile(p,(e,d)=>{if(e){res.statusCode=404;return res.end("No encontrado")}res.setHeader("Content-Type",types[path.extname(p)]||"application/octet-stream");res.end(d)})
}).listen(process.env.PORT||3000,()=>console.log("Listo en http://localhost:"+(process.env.PORT||3000)+" (clientes de prueba, clave 1234)"));
