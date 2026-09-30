# Base de datos PostgreSQL gestionada.
resource "render_postgres" "db" {
  name          = "nexo-inventario-db"
  plan          = var.plan
  region        = var.region
  version       = "16"
  database_name = "nexo_inventario"
  database_user = "nexo"
}

# Servicio web: construye la imagen a partir del Dockerfile del repositorio
# y ejecuta el contenedor en el ambiente Cloud.
resource "render_web_service" "app" {
  name   = "nexo-inventario"
  plan   = var.plan
  region = var.region

  runtime_source = {
    docker = {
      repo_url = var.repo_url
      branch   = var.branch
      # Ruta del Dockerfile dentro del repositorio.
      dockerfile_path = "./Dockerfile"
    }
  }

  # La cadena de conexión se inyecta como variable de entorno (secreto),
  # tomada directamente del recurso de base de datos. No se escribe a mano.
  env_vars = {
    NODE_ENV = { value = "production" }
    PORT     = { value = "3000" }
    DATABASE_URL = {
      value = render_postgres.db.connection_info.external_connection_string
    }
  }

  # El proveedor usa el endpoint de salud para validar cada despliegue.
  health_check_path = "/health"
}
