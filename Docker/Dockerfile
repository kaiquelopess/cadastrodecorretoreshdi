FROM node:11.6.0 as builder

RUN mkdir -p /usr/src/hdi-cadastro-corretores-bpm
WORKDIR /usr/src/hdi-cadastro-corretores-bpm
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 4200
CMD ng serve --proxy-config proxy.config.json