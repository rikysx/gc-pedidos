# Pedidos Global Cristal — versión con servidor

Qué hace distinto a la versión de un solo archivo:
- El RUT y la clave se validan en el servidor. Las claves se guardan cifradas (nunca en texto).
- Los precios y el stock **no viajan al navegador**: el servidor calcula la cotización y solo devuelve el resultado.
- Cada pedido queda registrado con número correlativo (GC-00001, GC-00002…), cliente, fecha, detalle y totales.

## Probarlo en tu computador (opcional, necesita Node 18+)
    node dev-server.js
Abre http://localhost:3000 — usa RUT 11.111.111-1 y clave 1234 (clientes de prueba, solo en este modo).

## Publicarlo (cuentas gratuitas: Supabase, GitHub y Vercel)
1. **Supabase** (supabase.com): crea un proyecto. En *SQL Editor* pega y ejecuta `db/schema.sql`, y después `db/clientes-demo.sql`.
2. En Supabase, *Project Settings → API*: copia la **Project URL** y la clave **service_role** (es secreta: no la compartas ni la subas a GitHub).
3. **GitHub**: crea un repositorio privado y sube esta carpeta.
4. **Vercel** (vercel.com): *Add New → Project*, elige ese repositorio. Antes de desplegar, en *Environment Variables* agrega:
   - `SUPABASE_URL` = la Project URL
   - `SUPABASE_SERVICE_KEY` = la clave service_role
   - `SESSION_SECRET` = un texto largo al azar (mínimo 32 caracteres)
5. Despliega. Vercel te da un enlace; luego puedes conectar tu dominio (ej. pedidos.globalcristal.cl).

## Cargar los clientes reales
- Uno por uno: `node scripts/nuevo-cliente.js 12.345.678-5 "Óptica Ejemplo" laClave` imprime el SQL para pegar en Supabase.
- Muchos: un CSV con encabezado `rut,nombre,clave` y `node scripts/importar-clientes.js clientes.csv > clientes.sql`; pegas el resultado en Supabase.
- Para desactivar un cliente: en la tabla `clientes`, `activo = false`.
- Los pedidos se ven en Supabase → *Table Editor → pedidos*.

## Todavía no incluido
- Envío automático a WhatsApp con el Excel adjunto (hoy sigue el enlace de WhatsApp con el resumen).
- Correo de respaldo de cada pedido.
- Panel propio para ver pedidos y editar clientes/precios (hoy se hace desde Supabase y editando `lib/catalogo.js`).
- El límite de intentos de clave es básico (por dirección, en memoria del servidor).

## Estructura
- `public/index.html` — la aplicación que ve el cliente.
- `api/login.js`, `api/cotizar.js`, `api/pedido.js` — el servidor.
- `lib/catalogo.js` — **catálogo, stock y precios** (aquí se actualizan).
- `lib/cotizar.js`, `lib/auth.js`, `lib/db.js`, `lib/http.js` — reglas de cotización, claves y base de datos.
