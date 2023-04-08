FROM ruby:latest as build

ENV JEKYLL_ENV: production

WORKDIR /usr/src/app

COPY Gemfile.lock .

COPY scripts scripts

RUN ./scripts/install

COPY . /usr/src/app

RUN  jekyll build -d public

FROM httpd:2.4-alpine

COPY --from=build /usr/src/app/public/ /usr/local/apache2/htdocs/