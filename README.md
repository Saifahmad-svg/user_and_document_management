# NestJS User and Document Management Backend

This is a modular backend application built with **NestJS**, supporting:

- User authentication with JWT
- Role-based access control (Admin, Editor, Viewer)
- Document upload and management
- Kafka-based ingestion pipeline
- PostgreSQL integration

---

## 📦 Features

- JWT Authentication (Register, Login)
- Role Management (Admin-only APIs)
- Document CRUD + File Upload
- Kafka event emission for ingestion
- Python microservice handles image/video processing
- Ingestion status tracking

---

## 🛠 Tech Stack

- NestJS + TypeScript
- PostgreSQL (via TypeORM)
- Kafka (via KafkaJS)
- Multer for file uploads
- Jest for unit testing
- Docker for deployment

---

### 🔧 Setup

1. **Clone the repo**

```bash
git clone https://github.com/Saifahmad-svg/user_and_document_management.git
cd user_and_document_management
```

2. **Install Dependencies**

```bash
npm install
```

3. **Setup Envs**

```bash
POSTGRES_USERNAME
POSTGRES_PASSWORD
POSTGRES_DB
POSTGRES_HOST
POSTGRES_PORT


KAFKA_BROKER
KAFKA_GROUP_ID
KAFKA_CLIENT_ID
KAFKA_TOPIC
```

4. **Start the app**

```bash
npm run start
```
