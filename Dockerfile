FROM nginx:latest

# File Author / Maintainer
LABEL authors="Alexandru Florian Barascu <alex.florin2352@gmail.com>"
MAINTAINER alex.florin2352@gmail.com

ENV PORT=80

WORKDIR /usr/share/nginx/html

COPY ./build /usr/share/nginx/html
COPY ./config/compression.conf /etc/nginx/conf.d/compression.conf

EXPOSE $PORT

ENTRYPOINT ["nginx", "-g", "daemon off;"]
