# Dockerfile — Frontend React (multi-stage build)
# Estágio 1: Build da aplicação com Node.js
# Estágio 2: Serve os arquivos estáticos com nginx

# ─── Estágio 1: Build ────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copia os arquivos de dependências primeiro (aproveita cache do Docker)
COPY package*.json ./
RUN npm install

# Copia o restante do código
COPY . .

# Recebe a URL do backend como argumento de build
# Permite configurar VITE_API_URL no momento do docker build
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

# Gera os arquivos estáticos otimizados
RUN npm run build

# ─── Estágio 2: Servidor nginx ────────────────────────────────────────────
FROM nginx:alpine

# Copia os arquivos buildados para o diretório padrão do nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração nginx para suporte ao React Router (SPA)
# Redireciona todas as rotas para index.html
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
