# NestJS + PostgreSQL Task Manager API

## Overview

This is a simple task management service built with **NestJS** and **PostgreSQL**. It supports CRUD operations on tasks and provides a reporting endpoint with optional webhook integration.

---

## 📦 Running the Project

### 🔧 Prerequisites

Ensure the following tools are installed on your machine:

- [Docker & Docker Compose](https://docs.docker.com/get-docker/)
- [pnpm](https://pnpm.io/installation) (used for package management if running locally)

---

### 🚀 Running with Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone <your-repository-url>
   cd <your-project-directory>
   ```

2. Start the application and PostgreSQL database:

   ```bash
   docker compose up --build
   ```

This will:

- Launch the API server at: [http://localhost:3000/api](http://localhost:3000/api)
- Serve Swagger documentation at: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

---

### 🛠 Running Locally (Without Docker)

> ⚠️ Make sure PostgreSQL is installed and running locally before continuing.

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create a `.env` file at the project root:

   ```env
   PORT=3000

   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=postgres
   ```

3. Build the project:

   ```bash
   pnpm build
   ```

4. Run the server:
   - Development mode:

     ```bash
     pnpm start:dev
     ```

   - Production mode:
     ```bash
     pnpm start
     ```

---

## 📘 API Overview

### Available Endpoints

| Endpoint     | Method | Description                       |
| ------------ | ------ | --------------------------------- |
| `/tasks`     | POST   | Create a new task                 |
| `/tasks`     | GET    | Get a paginated list of tasks     |
| `/tasks/:id` | GET    | Get task by ID                    |
| `/tasks/:id` | PATCH  | Update a task                     |
| `/tasks/:id` | DELETE | Soft delete a task                |
| `/report`    | GET    | Get task counts grouped by status |
| `/webhooks`  | POST   | Register a webhook URL (optional) |

---

## 📋 Request and Response Details

### Create Task - `POST /tasks`

**Request Body:**

```json
{
  "title": "Task title",
  "description": "Optional description",
  "dueDate": "2025-12-31T23:59:59.000Z",
  "status": "OPEN"
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "title": "...",
  "description": "...",
  "status": "OPEN",
  "dueDate": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

### Report - `GET /report`

**Response:**

```json
{
  "OPEN": 4,
  "IN_PROGRESS": 2,
  "DONE": 6
}
```

---

## 🔔 Webhook Support

- You can register a webhook with:

  ```json
  POST /webhooks
  {
    "url": "https://your-endpoint.com/webhook"
  }
  ```

- The system will send a `POST` request to the registered URL when a task is near its due date.

---

## 🔐 Environment Configuration

You can configure the app using the `.env` file. Sample:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=postgres
```

---

## 🧪 Testing (Optional)

If tests are implemented, run them with:

```bash
pnpm test
```

---

## ✅ Evaluation Criteria

1. **Functional completeness** – all required endpoints work
2. **Code quality & architecture** – clean separation (controllers, services, database)
3. **Data modeling** – appropriate schema, validation, and indexes
4. **Error handling** – proper HTTP codes and feedback
5. **Commit hygiene** – meaningful commit messages

---

## 📄 License

This project is provided as-is for educational and evaluation purposes.
