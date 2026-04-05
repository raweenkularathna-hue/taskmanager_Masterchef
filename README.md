# MasterChef Recipe Share

A full-stack web application for sharing, browsing, and managing recipes — built with React, Node.js/Express, and MongoDB.

---

## Live Demo

**Public URL:** http://15.135.194.34


Demo accounts available on the login page:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@recipe.com | admin123 |
| User | sarah@recipe.com | user123 |
| User | mike@recipe.com | user123 |

---

## Features

- **User Authentication** — Register, login, logout with JWT
- **Recipe Browsing** — View all approved recipes on the home page
- **Recipe Details** — Full recipe view with ingredients, instructions, and image
- **Recipe Management** — Authenticated users can create, edit, and delete their own recipes
- **Image Upload** — Upload recipe photos via multipart form
- **Admin Moderation** — Admins approve or reject submitted recipes before they appear publicly
- **Profile Management** — Update name/email and change password
- **Responsive UI** — Design with Tailwind CSS

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, Tailwind CSS, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| File Upload | Multer |
| Process Manager | PM2 |
| Web Server | Nginx (reverse proxy) |
| CI/CD | GitHub Actions (self-hosted runner on AWS EC2) |
| Hosting | AWS EC2 (Ubuntu 24.04) |

---

## Project Structure

```
taskmanagerv1/
├── backend/
│   ├── server.js               # Express app entry point
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Route handler logic
│   ├── middleware/             # Auth & upload middleware
│   ├── models/                 # Mongoose schemas (User, Recipe)
│   ├── routes/                 # API route definitions
│   ├── seed/seed.js            # Database seeder
│   └── test/                   # Mocha/Chai tests
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/axios.js        # Axios instance with base URL
│       ├── components/         # Navbar, Footer, RecipeCard, etc.
│       ├── context/            # AuthContext (global auth state)
│       └── pages/              # Home, Login, Register, Profile, etc.
├── .github/workflows/ci.yml    # GitHub Actions CI/CD pipeline
├── ecosystem.config.js         # PM2 process configuration
└── README.md
```

---

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/en) v18+
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)
- [MongoDB Atlas](https://account.mongodb.com/account/login) account
- [Yarn](https://yarnpkg.com/) (`npm install -g yarn`)

### 1. Clone the repository

```bash
git clone https://github.com/raweenkularathna-hue/taskmanager_Masterchef.git
cd taskmanager_Masterchef
```

### 2. Configure backend environment

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/recipedb
JWT_SECRET=your_jwt_secret_here
PORT=5001
```

### 3. Install dependencies

```bash
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
yarn install
```

### 4. Seed the database

```bash
cd backend
npm run seed
```

### 5. Start development servers

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
yarn start
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api

---

## Available Scripts

### Backend (`/backend`)

| Command | Description |
|---------|-------------|
| `npm start` | Start server with Node.js |
| `npm run dev` | Start server with Nodemon (auto-reload) |
| `npm test` | Run Mocha/Chai tests |
| `npm run seed` | Clear database and insert demo data |

### Frontend (`/frontend`)

| Command | Description |
|---------|-------------|
| `yarn start` | Start React dev server |
| `yarn build` | Build production bundle to `/build` |
| `yarn test` | Run React tests |

---

## API Overview

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | No | Create new user account |
| POST | `/login` | No | Login and receive JWT |
| GET | `/profile` | Yes | Get current user profile |
| PUT | `/profile` | Yes | Update name/email |
| PUT | `/change-password` | Yes | Change password |

### Recipe Routes — `/api/recipes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | No | Get all approved recipes |
| GET | `/:id` | No | Get single recipe by ID |
| GET | `/my` | Yes | Get current user's recipes |
| POST | `/` | Yes | Create a new recipe |
| PUT | `/:id` | Yes | Update own recipe |
| DELETE | `/:id` | Yes | Delete own recipe |
| POST | `/upload` | Yes | Upload recipe image |
| GET | `/admin/all` | Admin | Get all recipes (any status) |
| PUT | `/admin/:id/status` | Admin | Approve or reject a recipe |

---

## Production Deployment (AWS EC2)

### Nginx Configuration

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:5001;
    }

    location /uploads {
        proxy_pass http://localhost:5001;
    }
}
```


## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push to `main`:

1. **Checkout** code on self-hosted EC2 runner
2. **Setup Node.js** v22
3. **Install** backend and frontend dependencies
4. **Build** frontend production bundle
5. **Run** backend tests (`npm test`)
6. **Seed** database with demo data (`npm run seed`)
7. **Write** `.env` from GitHub Secrets
8. **Restart** app via PM2 (`pm2 startOrRestart`)
9. **Save** PM2 process list

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `PORT` | Backend port (5001) |
| `PROD` | Full `.env` file contents for production |


