# Этап сборки
FROM node:20-alpine AS builder

# Устанавливаем зависимости для сборки
RUN apk add --no-cache python3 make g++ gcc

WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем все зависимости, включая devDependencies
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Устанавливаем только production зависимости
RUN npm ci --only=production

# Финальный этап
FROM node:20-alpine

# Устанавливаем необходимые runtime зависимости для argon2
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

# Копируем собранное приложение и production зависимости
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"] 