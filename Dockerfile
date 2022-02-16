FROM node:14.17.5

WORKDIR /usr/src/app

RUN mkdir -p /usr/src/app/frontend

COPY frontend/package.json ./frontend

COPY package.json .

RUN yarn install

COPY . /usr/src/app/

CMD ["yarn", "serve"]