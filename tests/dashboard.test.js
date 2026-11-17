'use strict';

const request = require('supertest');

jest.mock('../src/db', () => ({ query: jest.fn() }));
const app = require('../src/app');

describe('Dashboard de monitoreo', () => {
  it('GET /metrics.json responde 200 con métricas en JSON', async () => {
    const res = await request(app).get('/metrics.json');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('requests_total');
    expect(res.body).toHaveProperty('uptime_seconds');
  });

  it('GET /dashboard sirve la página de monitoreo', async () => {
    const res = await request(app).get('/dashboard');
    expect(res.status).toBe(200);
    expect(res.text).toContain('NEXO');
    expect(res.text).toContain('Monitoreo');
  });

  it('/ lista el endpoint del dashboard', async () => {
    const res = await request(app).get('/');
    expect(res.body.endpoints).toContain('/dashboard');
  });
});
