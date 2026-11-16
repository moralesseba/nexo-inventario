'use strict';

// Métricas en memoria para el monitoreo del servicio.
// Se exponen en /metrics en formato de texto estilo Prometheus, de modo que
// una herramienta de monitoreo (Prometheus/Grafana, UptimeRobot, o el panel de
// Render) pueda recopilarlas. Es el equivalente de aplicación a las métricas
// que se enviarían a AWS CloudWatch.
const startTime = Date.now();

const counters = {
  requests_total: 0,
  requests_2xx: 0,
  requests_4xx: 0,
  requests_5xx: 0,
};
let lastLatencyMs = 0;

function record(statusCode, latencyMs) {
  counters.requests_total += 1;
  if (statusCode >= 500) counters.requests_5xx += 1;
  else if (statusCode >= 400) counters.requests_4xx += 1;
  else if (statusCode >= 200) counters.requests_2xx += 1;
  lastLatencyMs = Math.round(latencyMs);
}

function snapshot() {
  return Object.assign({}, counters, {
    uptime_seconds: Math.round((Date.now() - startTime) / 1000),
    last_latency_ms: lastLatencyMs,
  });
}

// Salida en formato de texto compatible con Prometheus.
function prometheus() {
  const s = snapshot();
  return (
    [
      '# HELP nexo_requests_total Total de solicitudes HTTP atendidas',
      '# TYPE nexo_requests_total counter',
      `nexo_requests_total ${s.requests_total}`,
      `nexo_requests_2xx ${s.requests_2xx}`,
      `nexo_requests_4xx ${s.requests_4xx}`,
      `nexo_requests_5xx ${s.requests_5xx}`,
      '# HELP nexo_uptime_seconds Tiempo en línea del servicio en segundos',
      '# TYPE nexo_uptime_seconds gauge',
      `nexo_uptime_seconds ${s.uptime_seconds}`,
      '# HELP nexo_last_latency_ms Latencia de la última solicitud en ms',
      '# TYPE nexo_last_latency_ms gauge',
      `nexo_last_latency_ms ${s.last_latency_ms}`,
    ].join('\n') + '\n'
  );
}

module.exports = { record, snapshot, prometheus };
