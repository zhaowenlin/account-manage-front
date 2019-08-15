# 本地测试
# docker build -t local/test:1 --build-arg QN_AKEY=xxxxxx --build-arg QN_SKEY=xxxxxx .
FROM zenato/puppeteer AS build
USER root
WORKDIR /app
COPY ./libs /app/libs
COPY ./.npmrc ./package.json ./package-lock.json /app/
RUN npm install
COPY . /app/
RUN npm run build --env production

FROM node:10
WORKDIR /app
COPY ./.npmrc ./package.json ./package-lock.json /app/
RUN npm install --production
COPY ./server.js /app/
COPY ./env /app/env
COPY --from=build /app/dist /app/dist
EXPOSE 5000
CMD ["node", "server"]
