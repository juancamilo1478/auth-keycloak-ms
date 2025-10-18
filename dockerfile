FROM node:18-alpine

# 1️⃣ Variables de entorno
ARG PORT
ARG POSTGRES_PASSWORD
ARG POSTGRES_USER
ARG JWT_SECRET
ARG DB_NAME
ARG NATS_SERVERS
ARG DATABASE_URL
ARG HOST
ENV PORT=$PORT
ENV POSTGRES_PASSWORD=$POSTGRES_PASSWORD
ENV POSTGRES_USER=$POSTGRES_USER
ENV JWT_SECRET=$JWT_SECRET
ENV DB_NAME=$DB_NAME
ENV NATS_SERVERS=$NATS_SERVERS
ENV DATABASE_URL=$DATABASE_URL
ENV HOST=$HOST

# 2️⃣ Dependencias del sistema
RUN apk add --no-cache python3 make g++

# 3️⃣ Directorio de trabajo
WORKDIR /usr/src/app

# 4️⃣ Copiar dependencias e instalarlas
COPY package*.json ./
RUN npm install

# 5️⃣ Instalar ts-node (para ejecutar .ts directamente)
RUN npm install -g ts-node typescript @nestjs/cli

# 6️⃣ Copiar el resto del código fuente
COPY . .

# 7️⃣ Exponer el puerto
EXPOSE ${PORT}

# 8️⃣ Iniciar sin build
CMD ["npx", "ts-node", "src/main.ts"]
