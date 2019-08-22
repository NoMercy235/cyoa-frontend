FROM nginx:latest

LABEL authors="Alexandru Florian Barascu <alex.florin2352@gmail.com>"
MAINTAINER alex.florin2352@gmail.com

WORKDIR /usr/share/nginx/html

COPY ./build /usr/share/nginx/html
COPY ./config/default.conf /etc/nginx/conf.d/default.conf

COPY ./config/ssl.conf /config/nginx/ssl.conf
COPY ./config/compression.conf /config/nginx/compression.conf

EXPOSE 80 443

ENTRYPOINT ["nginx", "-g", "daemon off;"]
