FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY _utils/docker-nginx/nginx.conf /etc/nginx/nginx.conf
COPY /output /usr/vendor/output
COPY /playground /usr/vendor/playground

CMD ["nginx", "-g", "daemon off;"]
