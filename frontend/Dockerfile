# 1. Используем официальный Node образ для сборки
FROM node:20-alpine AS build

# 2. Рабочая директория внутри контейнера
WORKDIR /app

# 3. Копируем package.json и package-lock.json из папки frontend
COPY frontend/package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 5. Копируем весь фронт-код из папки frontend
COPY frontend/ .

# 6. Собираем production билд через Vite
RUN npm run build

# === Финальный образ для nginx ===
FROM nginx:alpine

# 7. Копируем готовый билд в nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 8. Открываем порт
EXPOSE 80

# 9. Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
