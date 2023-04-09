FROM ruby:latest as build

ARG FTP_USER

ARG FTP_PASS

ARG FTP_HOST

ENV JEKYLL_ENV: production

WORKDIR /usr/src/app

COPY Gemfile.lock .

COPY scripts scripts

RUN ./scripts/install

COPY . /usr/src/app

RUN  jekyll build -d public

FROM alpine:latest

ARG FTP_USER

ARG FTP_PASS

ARG FTP_HOST

RUN apk add --no-cache wget

COPY --from=build /usr/src/app/public/ /usr/src/app/public/

RUN cd /usr/src/app/public/ && wget --continue --mirror --recursive --level=inf --timestamping --no-remove-listing --no-host-directories --ftp-user=$FTP_USER --ftp-password=$FTP_PASS ftp://$FTP_HOST/web/
