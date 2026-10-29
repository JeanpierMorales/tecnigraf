# TECNI-GRAF · Gestión de proyectos de diseño gráfico

Aplicación web para registrar, listar, buscar y eliminar proyectos de diseño gráfico, con el cálculo del valor de cada proyecto y el reporte de facturación.

## Tecnologías

- **Frontend:** HTML, CSS y JavaScript.
- **Backend:** Node.js con Express.
- **Base de datos:** Supabase (PostgreSQL).

## Estructura

```
frontend/   interfaz web (index.html, css/, js/)
backend/    API REST en capas: rutas → controlador → servicio → repositorio
docs/       diagrama de componentes y script de la base de datos
```

## Cómo ejecutarlo

1. Crear la tabla en Supabase con `docs/base-de-datos.sql` (SQL Editor).
2. Copiar `backend/.env.example` como `backend/.env` y completar `SUPABASE_URL` y `SUPABASE_KEY` (clave secreta del proyecto).
3. Instalar y levantar:

```bash
cd backend
npm install
npm start
```

4. Abrir http://localhost:3000

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/proyectos` | Lista los proyectos y el resumen de facturación |
| GET | `/api/proyectos/:codigo` | Busca un proyecto por su código |
| POST | `/api/proyectos` | Registra un proyecto |
| DELETE | `/api/proyectos/:codigo` | Elimina un proyecto |
