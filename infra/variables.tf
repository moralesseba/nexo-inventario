variable "render_api_key" {
  description = "API key de Render (secreto). Exportar como TF_VAR_render_api_key."
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "ID del owner/equipo en Render (empieza con usr- o tea-)."
  type        = string
}

variable "repo_url" {
  description = "URL del repositorio Git de la aplicación."
  type        = string
  default     = "https://github.com/moralesseba/nexo-inventario"
}

variable "branch" {
  description = "Rama que se despliega."
  type        = string
  default     = "main"
}

variable "region" {
  description = "Región del proveedor Cloud."
  type        = string
  default     = "oregon"
}

variable "plan" {
  description = "Plan de recursos (free para capa gratuita)."
  type        = string
  default     = "free"
}
