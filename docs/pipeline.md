# Diagrama del pipeline CI/CD

## Integración Continua (CI) — `.github/workflows/ci.yml`

Disparador: cada `push` o `pull request` a `main` / `develop`.

```mermaid
flowchart LR
    A[Push / Pull Request] --> B[Checkout del código]
    B --> C[Instalar dependencias<br/>npm ci]
    C --> D[Análisis estático<br/>npm run lint]
    D --> E[Pruebas automatizadas<br/>npm test]
    E --> F[Build de imagen<br/>docker build]
    F --> G{¿Todo verde?}
    G -- Sí --> H[Listo para integrar / desplegar]
    G -- No --> X[Falla el pipeline<br/>bloquea el merge]
```

**Condiciones de falla:** el pipeline se detiene y marca error si falla el
lint, si alguna prueba no pasa, o si la imagen no se construye. Con la rama
`main` protegida, un pipeline en rojo impide integrar el cambio.

## Entrega Continua (CD) — `.github/workflows/cd.yml`

Disparador: publicación de una etiqueta de versión `vX.Y.Z` (o ejecución manual).

```mermaid
flowchart LR
    A[Tag vX.Y.Z] --> B[Build de imagen]
    B --> C[Publicar imagen en GHCR]
    C --> D[Disparar despliegue en Render<br/>Deploy Hook]
    D --> E[Render provisiona/actualiza<br/>el contenedor]
    E --> F[Health check /health]
    F --> G{200 OK}
    G -- Sí --> H[Nueva versión en línea]
    G -- No --> I[Render conserva la versión anterior]
```

Las credenciales (`GITHUB_TOKEN`, `RENDER_DEPLOY_HOOK_URL`) se gestionan como
**secretos de la plataforma** y nunca se escriben en el código.
