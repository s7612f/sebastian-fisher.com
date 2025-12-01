FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ../infra/pwa-service-worker.js /usr/share/nginx/html/sw.js
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
