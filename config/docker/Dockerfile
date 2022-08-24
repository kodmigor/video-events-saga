FROM node:16.16.0-alpine AS build
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.22.0-alpine
COPY --from=build /app/dist /opt/site
COPY config/nginx.conf /etc/nginx/nginx.conf