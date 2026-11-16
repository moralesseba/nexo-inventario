'use strict';

const request = require('supertest');

jest.mock('../src/db', () => ({ query: jest.fn() }));
const app = require('../src/app');

describe('Observabilidad y seguridad (Unidad 3)', () => {
  it('GET /metrics responde 200 en formato Prometheus', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/text\/plain/);
    expect(res.text).toContain('nexo_requests_total');
    expect(res.text).toContain('nexo_uptime_seconds');
  });

  it('incluye los encabezados de seguridad', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  it('no revela la tecnología del servidor (sin X-Powered-By)', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('las métricas cuentan las solicitudes atendidas', async () => {
    await request(app).get('/health');
    await request(app).get('/health');
    const res = await request(app).get('/metrics');
    const match = res.text.match(/nexo_requests_total (\d+)/);
    expect(match).not.toBeNull();
    expect(Number(match[1])).toBeGreaterThan(0);
  });

  it('/ lista el endpoint de métricas', async () => {
    const res = await request(app).get('/');
    expect(res.body.endpoints).toContain('/metrics');
  });
});
