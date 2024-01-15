FROM node:18.18

WORKDIR /usr/src/tctt

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000 

CMD ["npm", "run", "dev"]