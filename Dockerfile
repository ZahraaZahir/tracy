FROM node:22-slim


RUN apt-get update -y && \
    apt-get install -y openssl python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app


COPY package*.json ./


COPY prisma ./prisma/


RUN npm install

COPY . .


RUN npx prisma generate

EXPOSE 3050

CMD ["npm", "run", "dev"]