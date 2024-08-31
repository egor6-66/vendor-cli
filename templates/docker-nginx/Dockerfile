FROM node:20-alpine AS builder

WORKDIR /app
COPY .. .
RUN npm install
RUN ["npm", "run", "vendor:build"]

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY /nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/.vendor/output /usr/vendor

CMD ["nginx", "-g", "daemon off;"]
