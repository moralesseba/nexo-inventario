# Changelog

Todas las versiones relevantes del módulo de inventario de NEXO.
El proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [1.2.0] - Monitoreo, pruebas y seguridad DevSecOps (Unidad 3)
### Agregado
- **Logging estructurado** en formato JSON (`src/logger.js`) y middleware de
  observabilidad que registra cada solicitud (`src/middleware/observability.js`).
- **Endpoint `/metrics`** con métricas en formato Prometheus (total de
  solicitudes, por estado, uptime, latencia) para monitoreo.
- **Encabezados de seguridad** en todas las respuestas (`src/middleware/security.js`)
  y ocultamiento de la tecnología del servidor.
- **Rol de base de datos de mínimo privilegio** (`security/roles.sql`).
- **Job de seguridad en el pipeline**: `npm audit` de dependencias de producción
  y verificación de que no se versionen secretos.
- Nuevas **pruebas automatizadas** de métricas y seguridad (total: 15 pruebas).
### Seguridad
- El escaneo detectó una vulnerabilidad *high* en una dependencia transitiva de
  Express (`qs`); se corrigió con `npm audit fix` y el re-escaneo de producción
  quedó en 0 vulnerabilidades.

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
