# NEXO — Módulo de gestión de inventario

Solución DevOps para la Evaluación Sumativa de la Unidad 2: **infraestructura
como código en ambientes Cloud (código y acceso a plataforma)**.

Caso: **NEXO**, sistema de gestión del comercio ALMACÉN DOÑA PATY. Este
repositorio implementa una parte acotada —el **módulo de inventario**— como
una API REST contenerizada, con control de versiones, Integración Continua,
Entrega Continua e Infraestructura como Código.

> **Integrantes:** Benjamín Nabarro — Sebastián Morales
> **Asignatura:** DevOps (TILE13) · INACAP

---

## 1. Requerimientos del proyecto

| Aspecto | Definición |
|---|---|
| Lenguaje / framework | Node.js 20 + Express |
| Base de datos | PostgreSQL 16 |
| Servicios | API de inventario (`/api/productos`) + base de datos |
| Puertos | 3000 (app), 5432 (BD) |
| Persistencia | Tabla `productos` (volumen local / instancia gestionada en la nube) |
| Variables de entorno | `NODE_ENV`, `PORT`, `DATABASE_URL` o `DB_*` |
| Proveedor Cloud | Render (capa gratuita) |
| Herramienta IaC | Terraform (`/infra`) — alternativa: `render.yaml` |

## 2. Estructura del repositorio

```
nexo-inventario/
├── src/                  # Aplicación (Express): rutas, controladores, BD
├── tests/                # Pruebas automatizadas (Jest + supertest)
├── db/init.sql           # Esquema y datos de ejemplo
├── Dockerfile            # Imagen de la aplicación (multi-etapa)
├── docker-compose.yml    # Orquestación local: app + PostgreSQL
├── .github/workflows/    # ci.yml (Integración Continua) y cd.yml (Entrega Continua)
├── infra/                # Infraestructura como Código (Terraform)
├── render.yaml           # IaC alternativa (Blueprint declarativo)
├── docs/                 # Arquitectura, diagrama del pipeline, parche v1.1
└── CHANGELOG.md          # Versiones desplegadas
```

## 3. Ejecutar en local

### Opción A — con Docker (recomendada)

```bash
docker compose up --build
```

Levanta la app y PostgreSQL. Prueba:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/productos
```

### Opción B — sin Docker

```bash
cp .env.example .env      # ajusta las variables
npm install
npm test                  # ejecuta las pruebas
npm start
```

## 4. Control de versiones (criterio 2.1)

- Repositorio Git con `README`, `.gitignore` y estructura de carpetas definida.
- Estrategia de ramas: `main` (protegida, estable) y ramas de funcionalidad
  `feature/*` integradas mediante **Pull Requests** revisados por otro integrante.
- Commits descriptivos siguiendo Conventional Commits (`feat:`, `fix:`, `docs:`…).
- El historial evidencia la participación de todos los integrantes.

## 5. Integración Continua (criterio 2.2)

`.github/workflows/ci.yml` se ejecuta en cada push/PR y realiza:
instalar dependencias → **lint** → **pruebas** → **build de la imagen**.
Ver el diagrama en [`docs/pipeline.md`](docs/pipeline.md).

## 6. Contenedores (criterio 2.4)

- `Dockerfile` multi-etapa, usuario sin privilegios y `HEALTHCHECK`.
- `docker-compose.yml` orquesta la aplicación y la base de datos.
- Requerimientos declarados: servicios, dependencias, puertos, persistencia y
  variables de entorno.

## 7. Entrega Continua e IaC (criterio 2.3)

### Infraestructura como Código (Terraform)

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars   # completa tus valores (no se versiona)
export TF_VAR_render_api_key=rnd_xxx           # secreto, nunca en el código
terraform init
terraform plan
terraform apply     # aprovisiona el ambiente Cloud
# ...
terraform destroy   # elimina el ambiente a partir del mismo código
```

> Alternativa declarativa: conectar el repositorio en Render como **Blueprint**
> para que lea `render.yaml`.

### Entrega Continua

`.github/workflows/cd.yml` se dispara al publicar una etiqueta `vX.Y.Z`:
construye y publica la imagen y dispara el despliegue en Render mediante un
**Deploy Hook**. Las credenciales se gestionan como **secretos** del repositorio
(`RENDER_DEPLOY_HOOK_URL`), nunca escritas en el código.

Ver [`docs/v1.1-patch.md`](docs/v1.1-patch.md) para publicar la **segunda
versión** (v1.1.0) y evidenciar dos despliegues sucesivos.

## 8. Cómo subirlo a GitHub

```bash
git init
git add .
git commit -m "chore: estructura inicial del proyecto (v1.0.0)"
git branch -M main
git remote add origin https://github.com/moralesseba/nexo-inventario.git
git push -u origin main
git tag v1.0.0 && git push origin v1.0.0    # dispara el primer despliegue (CD)
```

Luego habilita el acceso al repositorio para el docente (colaborador o repo
público) y comparte la URL de la aplicación desplegada.

## 9. Seguridad

- No se versionan credenciales, tokens ni claves (`.env` y `*.tfvars` están en
  `.gitignore`).
- Las credenciales se inyectan mediante variables de entorno y **secretos** de
  la plataforma (GitHub Actions / Render).

## Licencia

MIT.
