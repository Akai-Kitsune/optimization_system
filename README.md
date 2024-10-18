# Веб-приложение для решения нелинейных систем уравнений

## Установка проекта
### Docker
Для запуска проекта через docker-compose

```bash
docker compose up -d
```

После запуска приложение доступно по http://localhost:3000

Документация API находится по адресу http://localhost:5000/docs

### Нативно

#### Установка зависимостей
```bash
cd services/frontend/app && npm i && cd - &&
cd services/backend/app && pip install -r requirements.txt && cd -
```

### Запуск проекта
бэкенд
```bash
cd services/backend/app && python main.py
```

фронэнд
```bash
cd services/frontend/app && npm run start_local
```