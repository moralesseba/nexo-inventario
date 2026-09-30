'use strict';

const request = require('supertest');

jest.mock('../src/db', () => ({ query: jest.fn() }));
const db = require('../src/db');
const app = require('../src/app');

beforeEach(() => {
  db.query.mockReset();
});

describe('API de productos (inventario NEXO)', () => {
  it('GET /api/productos devuelve la lista', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 1, nombre: 'Arroz 1kg', sku: 'ARR-001', precio: 1290, stock: 40, categoria: 'Abarrotes' }],
    });
    const res = await request(app).get('/api/productos');
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].sku).toBe('ARR-001');
  });

  it('GET /api/productos/:id devuelve 404 si no existe', async () => {
    db.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).get('/api/productos/999');
    expect(res.status).toBe(404);
  });

  it('POST /api/productos crea un producto válido', async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: 2, nombre: 'Aceite 1L', sku: 'ACE-010', precio: 2490, stock: 15, categoria: 'Abarrotes' }],
    });
    const res = await request(app)
      .post('/api/productos')
      .send({ nombre: 'Aceite 1L', sku: 'ACE-010', precio: 2490, stock: 15, categoria: 'Abarrotes' });
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(2);
  });

  it('POST /api/productos rechaza datos inválidos (400)', async () => {
    const res = await request(app)
      .post('/api/productos')
      .send({ nombre: '', sku: '', precio: -5, stock: 1.5 });
    expect(res.status).toBe(400);
    expect(Array.isArray(res.body.errores)).toBe(true);
    expect(res.body.errores.length).toBeGreaterThan(0);
    expect(db.query).not.toHaveBeenCalled();
  });

  it('POST /api/productos devuelve 409 si el SKU está duplicado', async () => {
    db.query.mockRejectedValueOnce({ code: '23505' });
    const res = await request(app)
      .post('/api/productos')
      .send({ nombre: 'Arroz 1kg', sku: 'ARR-001', precio: 1290, stock: 40 });
    expect(res.status).toBe(409);
  });

  it('DELETE /api/productos/:id devuelve 204 al eliminar', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1 });
    const res = await request(app).delete('/api/productos/1');
    expect(res.status).toBe(204);
  });
});
