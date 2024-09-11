ARG IMAGE=node:20-alpine

FROM $IMAGE AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN ["vendor", "build"]

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder ./app/.vendor/output /usr/vendor/output

CMD ["nginx", "-g", "daemon off;"]
