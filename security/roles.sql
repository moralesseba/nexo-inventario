-- Control de accesos de la base de datos — principio de MÍNIMO PRIVILEGIO.
-- (Equivalente a definir un rol/política acotada en AWS IAM.)
--
-- La aplicación NO debe conectarse con el usuario dueño de la base ni con un
-- superusuario. Este script crea un rol de aplicación que solo puede operar
-- sobre la tabla "productos", sin permisos para modificar el esquema (DDL),
-- eliminar objetos ni administrar la base.
--
-- Uso: ejecutar una vez contra la base, y luego apuntar DATABASE_URL de la app
-- a este rol (la contraseña se gestiona como secreto de la plataforma).

-- 1) Rol de aplicación con login (la contraseña real se inyecta como secreto).
CREATE ROLE nexo_app LOGIN PASSWORD 'DEFINIR_COMO_SECRETO';

-- 2) Permisos mínimos indispensables.
GRANT CONNECT ON DATABASE nexo_inventario TO nexo_app;
GRANT USAGE ON SCHEMA public TO nexo_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON productos TO nexo_app;
GRANT USAGE, SELECT ON SEQUENCE productos_id_seq TO nexo_app;

-- 3) Se NIEGA todo lo demás por defecto: el rol no tiene privilegios de
--    CREATE/DROP/ALTER, ni acceso a otras tablas, ni rol de superusuario.
--    (No se otorga ningún GRANT adicional de forma intencional.)

-- Verificación sugerida:
--   \du nexo_app
--   \dp productos
