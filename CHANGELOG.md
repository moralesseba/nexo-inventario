# Changelog

Todas las versiones relevantes del módulo de inventario de NEXO.
El proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [1.1.0] - Segunda versión desplegada
### Agregado
- Endpoint `GET /api/productos/bajo-stock?umbral=N` para listar productos
  con stock bajo (apoya la reposición del almacén).
- Prueba automatizada asociada al nuevo endpoint.

> Ver `docs/v1.1-patch.md` para el detalle exacto del cambio. Esta versión
> se etiqueta como `v1.1.0` y dispara un segundo despliegue (Entrega Continua).

## [1.0.0] - Primera versión desplegada
### Agregado
- API REST del módulo de inventario: CRUD de productos.
- Endpoint de salud `GET /health`.
- Validación de datos y manejo centralizado de errores.
- Contenerización con Docker y orquestación con docker-compose (app + Postgres).
- Pipeline de Integración Continua (GitHub Actions): lint, pruebas y build.
- Entrega Continua e Infraestructura como Código (Terraform) hacia el proveedor Cloud.
