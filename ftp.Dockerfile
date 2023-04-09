FROM alpine:latest

ARG FTP_USER

ARG FTP_PASS

ARG FTP_HOST

RUN apk add --no-cache ncftp

COPY index.html /usr/src/app/public/

RUN ncftpput -R -v -z -u $FTP_USER -p $FTP_PASS $FTP_HOST /web/ /usr/src/app/public/*