# Seguridad DevOps (DevSecOps) — criterio 3.3

Prácticas de seguridad aplicadas a la gestión de accesos, la trazabilidad y la
protección del entorno, integradas al flujo DevOps.

## 1. Gestión de accesos y mínimo privilegio (equivalente a AWS IAM)

- La aplicación **no** se conecta con el usuario dueño/superusuario de la base.
- `security/roles.sql` define un **rol de aplicación** (`nexo_app`) con los
  privilegios mínimos indispensables: `SELECT, INSERT, UPDATE, DELETE` solo
  sobre la tabla `productos`, sin permisos de DDL, DROP ni administración.
- Esto limita el daño posible si las credenciales de la app se vieran expuestas.

## 2. Protección de credenciales

- **Ningún** secreto se versiona: `.env` y `*.tfvars` están en `.gitignore`.
- Las credenciales se inyectan como **variables de entorno / secretos** de la
  plataforma (GitHub Actions `secrets`, variables de entorno de Render).
- El pipeline incluye un control que **falla si se detecta un `.env` o
  `.tfvars` versionado**.

## 3. Controles de seguridad en el pipeline (CI)

El workflow `.github/workflows/ci.yml` incluye un job **`seguridad`** que:

- Ejecuta **`npm audit --omit=dev --audit-level=high`**: escaneo de
  vulnerabilidades sobre las dependencias que corren en producción. El pipeline
  **falla** si aparece una vulnerabilidad de severidad alta o crítica.
- Verifica que no haya archivos de secretos versionados.

> Durante el desarrollo, el escaneo detectó una vulnerabilidad *high* en una
> dependencia transitiva de Express (`qs`). Se corrigió con `npm audit fix`
> (parche sin cambios que rompan) y el re-escaneo de producción quedó en
> **0 vulnerabilidades**. Este es el ciclo DevSecOps: detectar → corregir →
> volver a escanear.

## 4. Endurecimiento de la aplicación

`src/middleware/security.js` agrega encabezados de seguridad a todas las
respuestas y se oculta la tecnología del servidor:

| Encabezado | Propósito |
|---|---|
| `X-Content-Type-Options: nosniff` | Evita *MIME sniffing* |
| `X-Frame-Options: DENY` | Evita *clickjacking* |
| `Content-Security-Policy` | Restringe orígenes de contenido |
| `Referrer-Policy: no-referrer` | Evita fuga de la URL de origen |
| (sin `X-Powered-By`) | No revela que el backend es Express |

## 5. Trazabilidad

El logging estructurado por solicitud (ver `docs/MONITOREO.md`) deja un registro
auditable de la actividad del servicio, equivalente al propósito de **CloudTrail**.
