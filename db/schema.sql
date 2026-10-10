-- Pega esto completo en Supabase → SQL Editor → Run.
create table if not exists clientes (
  rut        text primary key,            -- sin puntos ni dígito verificador, ej. 11111111
  nombre     text not null,
  clave_hash text not null,               -- la clave nunca se guarda en texto (se genera con scripts/nuevo-cliente.js)
  activo     boolean not null default true,
  creado     timestamptz not null default now()
);
create table if not exists pedidos (
  id        bigint generated always as identity primary key,
  numero    text generated always as ('GC-' || lpad(id::text, 5, '0')) stored,
  fecha     timestamptz not null default now(),
  rut       text not null,
  cliente   text not null,
  entrega   text not null check (entrega in ('retiro','despacho')),
  filas     jsonb not null,
  lineas    jsonb not null,
  neto      integer not null,
  iva       integer not null,
  total     integer not null,
  cristales integer not null
);
-- Nadie puede leer ni escribir desde el navegador: solo el servidor (con la clave de servicio).
alter table clientes enable row level security;
alter table pedidos  enable row level security;
