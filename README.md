# Zenbit Test Task - Backend API

This is the backend part (REST API) for the Zenbit test assignment. The backend provides user authentication, deal management, and media file uploads, offering a reliable architecture and secure data handling.

## 🚀 Tech Stack

- **Node.js & Express.js** — application core and routing.
- **Prisma ORM** — type-safe database interaction.
- **PostgreSQL (Neon)** — primary relational database (Serverless).
- **Cloudinary** — cloud storage for uploading and storing images.
- **JWT (JSON Web Tokens)** — authentication and authorization.
- **Joi / Zod** — validation of incoming data.
- **ESLint & Prettier** — maintaining code quality standards.

## ⚙️ Architecture

The project is built using a layered architecture, ensuring clear separation of concerns:

- **Routes:** Definition of API endpoints.
- **Controllers:** Handling HTTP requests and responses.
- **Services:** Application business logic.
- **Middleware:** Error handling, logging, token and access rights verification.

## 🛠 Installation and Local Run

### 1. Clone the repository 
```bash 
git clone https://github.com/your-username/zenbit-backend.git 
cd zenbit-backend
```
### 2. Install dependencies
```
npm install

```
### 3. Environment variables
```
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?schema=public"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
PORT=5000

```
### 4. Database setup
Run Prisma migrations to initialize the database schema:
```
npx prisma migrate dev

```
Generate Prisma client:
```
npx prisma generate

```
### 5. Start the server
```
npm run dev

```

📂 Project Structure

```
src/
├── controllers/ # Request handlers (auth, deals, users)
├── middleware/ # Middleware (auth, error handlers, logger)
├── routes/ # API route definitions
├── services/ # Business logic and Prisma interaction
├── utils/ # Helper functions (Cloudinary upload, wrappers)
├── validations/ # Data validation schemas
├── prisma.js # Prisma client initialization
└── server.js # Application entry point
prisma/
├── schema.prisma # Database schema
└── migrations/ # Database migration history
```

📖 API Endpoints
Authentication

    - POST /auth/register — Register a new user
    - Body: { "email": "string", "password": "string" }

    - POST /auth/login — Login and receive JWT
    - Body: { "email": "string", "password": "string" }

Users

    - GET /users/me — Get current user profile (requires JWT)

Deals

    - GET /deals — Get all deals

    - POST /deals — Create a new deal
    - Body: { "title": "string", "description": "string", "price": number }

    - GET /deals/:id — Get deal by ID

    - PUT /deals/:id — Update deal by ID

    - DELETE /deals/:id — Delete deal by ID

Media

    - POST /upload — Upload image to Cloudinary
    - Form-data: file
