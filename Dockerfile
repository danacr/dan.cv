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

RUN apk add --no-cache ncftp

COPY --from=build /usr/src/app/public/ /usr/src/app/public/

RUN ncftpput -R -v -z -u $FTP_USER -p $FTP_PASS $FTP_HOST /web/ /usr/src/app/public/*