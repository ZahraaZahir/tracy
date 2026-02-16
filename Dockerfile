FROM node:22-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --ignore-scripts

COPY . .

RUN npx prisma generate

EXPOSE 3050

CMD ["npm", "run", "dev"]
