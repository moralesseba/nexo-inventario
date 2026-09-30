# Changelog

Todas las versiones relevantes del módulo de inventario de NEXO.
El proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [1.1.1] - Corrección de base de datos vacía en la nube
### Corregido
- `GET /api/productos` respondía 500 en Render porque la base de datos
  gestionada parte vacía (`db/init.sql` solo lo ejecuta docker-compose).
- Nueva migración idempotente (`src/initDb.js`) que se ejecuta al iniciar la
  app: crea la tabla `productos` si no existe y carga los datos de ejemplo sin
  duplicarlos (`CREATE TABLE IF NOT EXISTS` + `ON CONFLICT (sku) DO NOTHING`).

## [1.1.0] - Segunda versión desplegada
### Agregado
- Endpoint `GET /api/productos/bajo-stock?umbral=N` para listar productos
  con stock bajo (apoya la reposición del almacén). Umbral por defecto: 10.
- Prueba automatizada asociada al nuevo endpoint.

> Publicada con el tag `v1.1.0`, que dispara el segundo despliegue
> (Entrega Continua). Detalle del cambio en `docs/v1.1-patch.md`.

## [1.0.0] - Primera versión desplegada
### Agregado
- API REST del módulo de inventario: CRUD de productos.
- Endpoint de salud `GET /health`.
- Validación de datos y manejo centralizado de errores.
- Contenerización con Docker y orquestación con docker-compose (app + Postgres).
- Pipeline de Integración Continua (GitHub Actions): lint, pruebas y build.
- Entrega Continua e Infraestructura como Código (Terraform) hacia el proveedor Cloud.
