# Используем официальный образ Node.js в качестве базового
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы приложения
COPY . .

# Сборка приложения для продакшна
RUN npm run build

# Используем более легкий образ для продакшна
FROM node:18-alpine AS runner

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем только необходимые артефакты из builder
COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Устанавливаем только необходимые зависимости для продакшна
RUN npm install --production

# Устанавливаем переменную окружения для Next.js
ENV NODE_ENV=production

# Открываем порт 3000
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
