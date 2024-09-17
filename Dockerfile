FROM node:18-alpine

WORKDIR /app

# required for node-canvas
# https://stackoverflow.com/questions/57088230/node-canvas-on-alpine-within-docker
RUN apk add --update --no-cache \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]