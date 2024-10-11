FROM node:16-alpine

LABEL authors="kanghokim"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./

COPY tsconfig.build.json ./

COPY tsconfig.paths.json ./

COPY . .

EXPOSE 8000

RUN npm run build

CMD ["npm", "run", "start:dev"]