FROM alpine:latest

ARG FTP_USER

ARG FTP_PASS

ARG FTP_HOST

RUN apk add --no-cache wget

COPY index.html /usr/src/app/public/

RUN cd /usr/src/app/public/ && wget \
  --continue \
  --mirror --recursive --level=inf --timestamping --no-remove-listing \
  --no-host-directories \
  --ftp-user=$FTP_USER \
  --ftp-password=$FTP_PASS \
    ftp://$FTP_HOST/web/