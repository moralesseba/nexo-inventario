'use strict';

const request = require('supertest');

// Mock de la capa de base de datos para no depender de Postgres en las pruebas.
jest.mock('../src/db', () => ({ query: jest.fn() }));

const app = require('../src/app');

describe('Health check', () => {
  it('GET /health responde 200 y status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('nexo-inventario');
  });

  it('GET / responde con la lista de endpoints', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.endpoints).toContain('/api/productos');
  });

  it('Ruta inexistente responde 404', async () => {
    const res = await request(app).get('/no-existe');
    expect(res.status).toBe(404);
  });
});
