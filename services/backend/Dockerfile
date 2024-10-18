# Используем официальное изображение Python как базовое
FROM python:3.11-slim AS base

# Устанавливаем зависимости для компиляции (если они необходимы)
# и создаем пользователя для запуска приложения
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем зависимости отдельно для оптимизации кэширования Docker
COPY requirements.txt ./

# Установим зависимости через pip
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Скопируем все файлы проекта в контейнер
COPY . .

# Создаем пользователя без root-доступа для запуска приложения
RUN useradd -m nonrootuser
USER nonrootuser

# Экспонируем порт для FastAPI
EXPOSE 5000

# Устанавливаем переменную окружения для корректной работы FastAPI в продакшн режиме
ENV PYTHONUNBUFFERED=1

# Команда для запуска FastAPI через Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "5000"]
