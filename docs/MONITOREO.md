# Monitoreo y logging (criterio 3.1)

El servicio incorpora mecanismos para **observar su comportamiento**, recopilar
registros y exponer métricas que apoyan la detección temprana de incidentes.

## Qué se monitorea

| Componente | Qué se observa | Dónde |
|---|---|---|
| Disponibilidad | Estado del servicio y versión | `GET /health` |
| Tráfico | Total de solicitudes y su clase (2xx/4xx/5xx) | `GET /metrics` |
| Rendimiento | Latencia de la última solicitud, uptime | `GET /metrics` |
| Actividad | Una línea de log por solicitud (método, ruta, estado, latencia) | Logs del servicio (Render) |
| Errores | Fallos 5xx y errores de inicialización de BD | Logs (nivel `error`) |

## Logging estructurado

Cada evento se registra como **una línea JSON** (`src/logger.js`), lo que
facilita filtrar, buscar y exportar los registros. Ejemplo real:

```json
{"ts":"2026-11-16T13:18:40.283Z","level":"info","service":"nexo-inventario","version":"1.2.0","message":"http_request","method":"GET","path":"/health","status":200,"latency_ms":1}
```

El middleware `src/middleware/observability.js` emite un registro por cada
solicitud y actualiza las métricas.

## Métricas (`/metrics`)

Se exponen en **formato de texto estilo Prometheus**, de modo que una
herramienta de monitoreo (Prometheus/Grafana, UptimeRobot o el panel del
proveedor) pueda recopilarlas periódicamente:

```
nexo_requests_total 42
nexo_requests_2xx 40
nexo_requests_4xx 1
nexo_requests_5xx 1
nexo_uptime_seconds 3600
nexo_last_latency_ms 3
```

## Equivalencia con AWS

- **Logs** → el enunciado sugiere **CloudWatch Logs**; aquí los logs JSON quedan
  en la consola del servicio en Render, lista para exportar.
- **Métricas/alarmas** → equivalente a **CloudWatch Metrics**; el endpoint
  `/metrics` es la fuente que un sistema de alertas consume para avisar ante
  errores 5xx o caídas.
- **Trazabilidad de acciones** → el enunciado sugiere **CloudTrail**; aquí el
  log estructurado por solicitud deja trazabilidad de la actividad del servicio.
