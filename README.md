# Менеджер Задач (Task Manager)

Это полнофункциональное REST API приложение для управления задачами, разработанное с использованием современного фреймворка NestJS. Приложение предоставляет удобный интерфейс для управления задачами, комментариями и пользователями с поддержкой аутентификации и авторизации.

## 📋 Основные возможности

- **Управление задачами**
  - Создание, просмотр, редактирование и удаление задач
  - Фильтрация задач по статусу
  - Назначение задач пользователям
  - Отслеживание статуса выполнения

- **Система комментариев**
  - Добавление комментариев к задачам
  - Просмотр истории обсуждений
  - Уведомления об обновлениях

- **Безопасность**
  - JWT-аутентификация
  - Хеширование паролей (Argon2)
  - Контроль доступа на основе ролей
  - Защита от основных веб-уязвимостей

## 🛠 Технологический стек

- **Backend Framework**: NestJS
- **Язык программирования**: TypeScript
- **База данных**: PostgreSQL
- **ORM**: TypeORM
- **Аутентификация**: JWT (JSON Web Tokens)
- **Безопасность**: Argon2 для хеширования
- **Документация**: Swagger/OpenAPI
- **Контейнеризация**: Docker

## 📋 Требования к системе

- Node.js (версия 20 или выше)
- Docker и Docker Compose (для контейнеризации)
- PostgreSQL (если запуск без Docker)
- npm (установщик пакетов Node.js)

## 🚀 Установка и запуск

### Установка через Docker (рекомендуется)

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/mashka818/manager.git
   cd manager
   ```

2. Создайте файл `.env` в корневой директории:
   ```env
   DATABASE_HOST=postgres
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=taskmanager
   JWT_SECRET=ваш-секретный-ключ
   ```

3. Запустите приложение через Docker Compose:
   ```bash
   docker-compose up -d
   ```

Приложение будет доступно по адресу: `http://localhost:3000`

### Ручная установка

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Создайте базу данных PostgreSQL:
   ```sql
   CREATE DATABASE taskmanager;
   ```

3. Настройте подключение к базе данных в файле `src/config/typeorm.config.ts`

4. Запустите приложение:
   ```bash
   npm run start:dev
   ```

## 📡 API Endpoints

### Аутентификация

- **POST** `/auth/register`
  - Регистрация нового пользователя
  - Тело запроса: `{ "email": "user@example.com", "password": "password123" }`

- **POST** `/auth/login`
  - Вход в систему
  - Тело запроса: `{ "email": "user@example.com", "password": "password123" }`
  - Возвращает JWT токен

### Задачи

- **GET** `/tasks`
  - Получение списка задач
  - Поддерживает фильтрацию: `/tasks?status=in_progress`

- **POST** `/tasks`
  - Создание новой задачи
  - Требует JWT авторизацию
  - Тело запроса: `{ "title": "Название", "description": "Описание" }`

- **GET** `/tasks/:id`
  - Получение информации о конкретной задаче

- **PUT** `/tasks/:id`
  - Обновление задачи
  - Требует JWT авторизацию
  - Доступно только создателю задачи

- **DELETE** `/tasks/:id`
  - Удаление задачи
  - Требует JWT авторизацию
  - Доступно только создателю задачи

### Комментарии

- **POST** `/tasks/:taskId/comments`
  - Добавление комментария к задаче
  - Требует JWT авторизацию

- **GET** `/tasks/:taskId/comments`
  - Получение всех комментариев к задаче

## 🔧 Конфигурация

### Переменные окружения

| Переменная | Описание | Пример значения |
|------------|----------|-----------------|
| DATABASE_HOST | Хост базы данных | localhost |
| DATABASE_PORT | Порт базы данных | 5432 |
| DATABASE_USERNAME | Имя пользователя БД | postgres |
| DATABASE_PASSWORD | Пароль от БД | postgres |
| DATABASE_NAME | Название БД | taskmanager |
| JWT_SECRET | Секретный ключ для JWT | your-secret-key |

## 🧪 Тестирование

```bash
# Запуск модульных тестов
npm run test

# Запуск end-to-end тестов
npm run test:e2e

# Проверка покрытия кода тестами
npm run test:cov
```

## 📁 Структура проекта

```
src/
├── auth/              # Модуль аутентификации
│   ├── dto/          # Data Transfer Objects
│   ├── guards/       # JWT Guard
│   └── strategies/   # Passport стратегии
├── tasks/            # Модуль задач
│   ├── dto/         # DTO для задач
│   └── entities/    # Сущность задачи
├── comments/         # Модуль комментариев
├── entities/         # Сущности базы данных
├── config/           # Конфигурационные файлы
└── main.ts           # Точка входа в приложение
```

## 📊 Модели данных

### Пользователь (User)
```typescript
{
  id: UUID,
  email: string,        // Уникальный email
  password: string,     // Хешированный пароль
  createdAt: Date,
  updatedAt: Date,
  tasks: Task[],        // Связанные задачи
  comments: Comment[]   // Комментарии пользователя
}
```

### Задача (Task)
```typescript
{
  id: UUID,
  title: string,
  description: string,
  status: 'pending' | 'in_progress' | 'done',
  creatorId: UUID,     // Создатель задачи
  createdAt: Date,
  updatedAt: Date,
  comments: Comment[]  // Комментарии к задаче
}
```

### Комментарий (Comment)
```typescript
{
  id: UUID,
  text: string,
  taskId: UUID,        // Связанная задача
  authorId: UUID,      // Автор комментария
  createdAt: Date
}
```

## 🔐 Безопасность

- Все пароли хешируются с использованием алгоритма Argon2
- Защита от SQL-инъекций через TypeORM
- Валидация входных данных с помощью class-validator
- CORS защита
- Rate limiting для предотвращения DDoS атак
- Защита от XSS атак

## 📝 Примеры запросов

### Регистрация пользователя

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

Ответ:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "createdAt": "2024-03-21T12:00:00.000Z"
}
```

### Вход в систему

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```

Ответ:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Создание задачи

```http
POST /tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Разработка новой функции",
  "description": "Реализовать систему уведомлений для пользователей"
}
```

Ответ:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Разработка новой функции",
  "description": "Реализовать систему уведомлений для пользователей",
  "status": "pending",
  "creatorId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-03-21T12:30:00.000Z",
  "updatedAt": "2024-03-21T12:30:00.000Z"
}
```

### Получение списка задач с фильтрацией

```http
GET /tasks?status=in_progress
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ответ:
```json
{
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Разработка новой функции",
      "description": "Реализовать систему уведомлений для пользователей",
      "status": "in_progress",
      "creatorId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-03-21T12:30:00.000Z",
      "updatedAt": "2024-03-21T13:00:00.000Z"
    }
  ],
  "total": 1
}
```

### Обновление статуса задачи

```http
PUT /tasks/550e8400-e29b-41d4-a716-446655440001
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "done",
  "description": "Реализовать систему уведомлений для пользователей - Завершено"
}
```

Ответ:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "Разработка новой функции",
  "description": "Реализовать систему уведомлений для пользователей - Завершено",
  "status": "done",
  "creatorId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-03-21T12:30:00.000Z",
  "updatedAt": "2024-03-21T14:00:00.000Z"
}
```

### Добавление комментария к задаче

```http
POST /tasks/550e8400-e29b-41d4-a716-446655440001/comments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "text": "Функционал протестирован и готов к релизу"
}
```

Ответ:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "text": "Функционал протестирован и готов к релизу",
  "taskId": "550e8400-e29b-41d4-a716-446655440001",
  "authorId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-03-21T14:15:00.000Z"
}
```

### Получение комментариев задачи

```http
GET /tasks/550e8400-e29b-41d4-a716-446655440001/comments
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ответ:
```json
{
  "comments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "text": "Функционал протестирован и готов к релизу",
      "taskId": "550e8400-e29b-41d4-a716-446655440001",
      "authorId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-03-21T14:15:00.000Z",
      "author": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "user@example.com"
      }
    }
  ],
  "total": 1
}
```

## �� Документация API

Swagger документация доступна по адресу `http://localhost:3000/api` после запуска приложения.


