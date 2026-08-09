# Dev-oriented image: source is bind-mounted in docker-compose.yml for hot
# reload, this just needs node_modules pre-installed in the image so the
# container doesn't depend on the host having Node at all.
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev"]
