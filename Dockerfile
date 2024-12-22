#FROM node:16-alpine
#
#LABEL authors="kanghokim"
#
#WORKDIR /app
#
#COPY package*.json ./
#
#RUN npm install
#
#COPY tsconfig.json ./
#
#COPY tsconfig.build.json ./
#
#COPY tsconfig.paths.json ./
#
#COPY . .
#
#EXPOSE 8000
#
#RUN npm run build
#
#CMD ["npm", "run", "start:dev"]

###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

WORKDIR /usr/src/backend

COPY --chown=node:node package*.json ./

RUN npm ci --legacy-peer-deps

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/backend

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/backend/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/backend/dist ./dist

CMD [ "node", "dist/main.js" ]