-- TECNI-GRAF: tabla de proyectos (ejecutar en Supabase > SQL Editor)
-- La tabla empieza vacía: no se cargan registros de ejemplo.

create table if not exists public.proyectos (
  id           bigint generated always as identity primary key,
  codigo       varchar(15)   not null unique,
  cliente      varchar(100)  not null,
  tipo_diseno  varchar(40)   not null,
  horas        numeric(10,2) not null check (horas > 0),
  costo_hora   numeric(12,2) not null check (costo_hora > 0),
  creado_en    timestamptz   not null default now(),
  constraint codigo_formato check (codigo ~ '^[A-Z0-9-]{3,15}$')
);

-- Con RLS activo y sin políticas, nadie con la clave pública puede leer ni escribir.
-- Solo el backend accede, usando la clave secreta guardada en el servidor.
alter table public.proyectos enable row level security;
