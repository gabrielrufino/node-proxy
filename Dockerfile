FROM node:18.14.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm pkg delete scripts.prepare && \
    npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
