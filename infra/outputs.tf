output "app_url" {
  description = "URL pública de la aplicación desplegada."
  value       = render_web_service.app.url
}

output "postgres_name" {
  description = "Nombre del recurso de base de datos aprovisionado."
  value       = render_postgres.db.name
}
