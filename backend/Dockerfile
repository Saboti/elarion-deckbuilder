FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npm install && npx prisma generate && until npx prisma db push; do echo 'Waiting for database...'; sleep 2; done && npm run dev"]
