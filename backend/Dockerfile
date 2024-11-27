FROM node:14

WORKDIR /backend 

ENV PATH=/backend/node_modules/.bin:$PATH

COPY package.json .
RUN npm install
COPY . .

EXPOSE 3001
CMD npm start