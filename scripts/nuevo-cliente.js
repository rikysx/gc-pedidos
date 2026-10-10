// Uso:  node scripts/nuevo-cliente.js 12345678-5 "Óptica Ejemplo" laClave
// Imprime el SQL para pegar en Supabase → SQL Editor.
const {hashClave,parseRut}=require("../lib/auth");
const [,, rutTxt, nombre, clave]=process.argv;
const rut=parseRut(rutTxt);
if(!rut||!nombre||!clave){console.error('Uso: node scripts/nuevo-cliente.js 12345678-5 "Nombre de la óptica" clave');process.exit(1)}
const q=s=>"'"+String(s).replace(/'/g,"''")+"'";
console.log(`insert into clientes (rut, nombre, clave_hash) values (${q(rut)}, ${q(nombre)}, ${q(hashClave(clave))})\non conflict (rut) do update set nombre = excluded.nombre, clave_hash = excluded.clave_hash, activo = true;`);
