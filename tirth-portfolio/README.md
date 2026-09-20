# Tirth Portfolio + Task Manager

Advanced Web Development Frameworks (ITUE301) practical project covering Practicals 1-7.

## Practicals Completed

- **P1:** React + Vite component architecture
- **P2:** React Router, useState, controlled input, dark/light mode
- **P3:** GitHub REST API integration with loading, error, retry and search
- **P4:** Node.js + Express REST API with CRUD and middleware
- **P5:** MongoDB + Mongoose schema, validation and persistent CRUD
- **P6:** React + Node + MongoDB full-stack CRUD integration
- **P7:** JWT authentication, bcrypt password hashing and protected task routes

## Project Structure

```text
src/                         React frontend
task-manager-api/            Express + MongoDB backend
  models/Task.js             Mongoose Task schema
  models/User.js             Mongoose User schema
  middleware/auth.js         JWT authentication middleware
  middleware/validateTask.js Server-side task validation
  server.js                  REST API
```

## Frontend Setup

```bash
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Backend Setup

```bash
cd task-manager-api
npm install
```

Copy `.env.example` to `.env` and set:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

Then run:

```bash
npm start
```

Backend runs at `http://localhost:5000`.

## P7 Flow

1. Register at `/register`.
2. Login at `/login`.
3. JWT is stored on the client for authenticated requests.
4. `/projects` is protected by `ProtectedRoute`.
5. The backend protects every `/tasks` endpoint with JWT middleware.
6. Task title/priority/completed values are validated on the server.
7. Logout clears the client token.

## API Endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/register` | No | Register user |
| POST | `/login` | No | Login and receive JWT |
| GET | `/me` | Yes | Current user |
| GET | `/tasks` | Yes | List user's tasks |
| GET | `/tasks/:id` | Yes | Get one task |
| POST | `/tasks` | Yes | Create task |
| PUT | `/tasks/:id` | Yes | Update task |
| DELETE | `/tasks/:id` | Yes | Delete task |

## Practical 6 Test Flow

Create → View → Update → Delete → Refresh browser → verify persistence.

## Practical 7 Test Flow

Register → Login → Copy token if testing in Thunder Client → access protected `/tasks` → test missing/invalid token → logout.

## Security Notes

- Passwords are hashed with bcryptjs before storage.
- JWT secret is stored in `.env` and `.env` is ignored by Git.
- The frontend never contains the MongoDB connection string or JWT secret.
- Do not commit real credentials or tokens.

## Git Evidence

Add screenshots/commit IDs for P5, P6 and P7 here after committing the work.
