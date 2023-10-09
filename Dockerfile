# syntax=docker/dockerfile:1

FROM node:18.7-slim AS BUILDER
LABEL maintainer="Luan Freitas"

WORKDIR /usr/src/app


# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm rebuild bcrypt 

COPY src ./src

FROM node:18.7-alpine

ARG NODE_ENV

WORKDIR /usr/src/app

COPY --from=BUILDER /usr/src/app/ ./

EXPOSE 3000

CMD [ "npm", "start" ]