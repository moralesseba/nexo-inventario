# Infraestructura como Código (IaC) del módulo de inventario de NEXO.
# Declara el ambiente Cloud (proveedor Render) de forma versionada.
# El ambiente NO se configura a mano: se crea y se destruye desde este código.

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.3"
    }
  }
}

provider "render" {
  # La API key se entrega por variable de entorno RENDER_API_KEY
  # o por variable de Terraform: NUNCA se escribe en el código.
  api_key  = var.render_api_key
  owner_id = var.render_owner_id
}
