FROM node:18-alpine

RUN mkdir -p ./app
COPY ../app ./app
WORKDIR ./app
RUN npm install

EXPOSE 3000
EXPOSE 4000

CMD ["npm", "run", "dev"]
