FROM node:14

WORKDIR /frontend

ENV PATH=/frontend/node_modules/.bin:$PATH

COPY package.json .
RUN npm install
COPY . .

RUN npm run build

EXPOSE 3000

# ENTRYPOINT [ "serve", "-s", "build" ]

CMD [ "npx", "serve", "build" ]

# CMD npx serve -s build