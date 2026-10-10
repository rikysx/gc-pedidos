// Uso:  node scripts/importar-clientes.js clientes.csv > clientes.sql
// El CSV tiene 3 columnas con encabezado:  rut,nombre,clave   (ej.  12.345.678-5,Óptica Central Ltda.,abc123)
const fs=require("fs"),{hashClave,parseRut}=require("../lib/auth");
const f=process.argv[2];if(!f){console.error("Uso: node scripts/importar-clientes.js clientes.csv > clientes.sql");process.exit(1)}
const q=s=>"'"+String(s).replace(/'/g,"''")+"'",out=[],malos=[];
fs.readFileSync(f,"utf8").split(/\r?\n/).slice(1).filter(x=>x.trim()).forEach((l,i)=>{
 const m=l.match(/^\s*([^,;]+)[,;]\s*"?([^",;]+)"?[,;]\s*(.+?)\s*$/);const rut=m&&parseRut(m[1]);
 if(!m||!rut){malos.push(`Línea ${i+2}: ${l}`);return}
 out.push(`(${q(rut)}, ${q(m[2].trim())}, ${q(hashClave(m[3]))})`)});
if(malos.length)console.error("No se pudieron leer estas líneas (RUT inválido o formato incorrecto):\n"+malos.join("\n"));
if(out.length)console.log("insert into clientes (rut, nombre, clave_hash) values\n"+out.join(",\n")+"\non conflict (rut) do update set nombre = excluded.nombre, clave_hash = excluded.clave_hash, activo = true;");
