FROM node:22-alpine3.21

WORKDIR /api
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000