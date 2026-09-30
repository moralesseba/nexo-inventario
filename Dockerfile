# ---- Etapa 1: dependencias de producción ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Etapa 2: imagen final ----
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Usuario sin privilegios (buena práctica de seguridad en contenedores).
RUN addgroup -S nexo && adduser -S nexo -G nexo

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src

USER nexo
EXPOSE 3000

# Verificación de salud del contenedor.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||3000)+'/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "src/server.js"]
