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

---

## Discussion

### Architecture Decisions

The MasterChef Recipe Share application was designed around a decoupled full-stack architecture. The frontend (React) and backend (Node.js/Express) are maintained as separate projects, communicating exclusively through a RESTful API. This separation allows each layer to be developed, tested, and deployed independently.

MongoDB Atlas was chosen as the database due to its flexible document model, which suits recipe data that contains variable-length arrays (ingredients, instructions) without requiring a rigid relational schema. Mongoose was used on top of MongoDB to enforce a consistent data structure through schema definitions and pre-save hooks, such as automatic password hashing when a user document is saved.

JWT-based authentication was implemented rather than session-based authentication because the application is stateless and served from a cloud instance. JWTs are signed with a secret key and verified on every protected route, removing the need for server-side session storage.

### CI/CD and Deployment

GitHub Actions was configured with a self-hosted runner installed directly on the AWS EC2 instance. This means every push to the `main` branch automatically installs dependencies, runs backend tests, builds the React frontend, seeds the database, and restarts the application using PM2 — without any manual SSH intervention.

Nginx was configured as a reverse proxy on port 80 to route requests to the appropriate service: the React build served by PM2 (`/`) and the Express API (`/api`). This eliminates the need to expose backend ports directly and gives a single clean entry point for browser traffic.

PM2 was chosen over running Node.js directly because it provides automatic process restart on crashes, log management, and the ability to register the app as a systemd service (`pm2 startup`), ensuring the application survives SSH disconnects and EC2 reboots.

### Challenges Encountered

One significant challenge during deployment was port binding conflicts (`EADDRINUSE`). Multiple PM2 restart attempts during CI runs left orphaned Node.js processes holding port 5001, preventing the backend from starting cleanly. This was resolved by adding a graceful stop step in the CI workflow before restarting, and by using `pm2 startOrRestart` with an ecosystem config file rather than ad-hoc `pm2 start`/`pm2 restart` commands.

Another challenge was ESLint treating warnings as errors in the React production build (`CI=true` sets `CI=true` which causes the build to fail on any warning). Unused imports across multiple components had to be cleaned up to allow the frontend build to succeed in the pipeline.

Image loading was also a consideration — the backend serves uploaded images as static files from the `uploads/` directory, and the seed script references these files using the EC2 public IP. This means seeded images are only available when the EC2 instance is running and accessible. In a production system, a service like AWS S3 would be a more robust and scalable solution for user-uploaded media.

### Security Considerations

- Passwords are hashed with bcrypt before storage; plain-text passwords are never persisted
- JWT tokens are verified on all protected routes using middleware before any database operation is performed
- Admin-only routes are protected by a secondary `adminOnly` middleware check on top of `protect`
- Environment variables (MongoDB URI, JWT secret) are stored as GitHub Secrets and injected at deploy time, never committed to the repository
- CORS is enabled on the backend to allow the frontend origin to communicate with the API

---

## Conclusion

The MasterChef Recipe Share project successfully demonstrates a complete software development lifecycle — from local development through automated CI/CD to a publicly accessible production deployment on AWS EC2. The application implements core full-stack concepts including RESTful API design, JWT authentication, role-based access control, file upload handling, and database seeding.

The GitHub Actions pipeline automates the entire deployment process: running tests, building the frontend, seeding the database, and restarting services on every push to `main`. This eliminates manual deployment steps and ensures a consistent, reproducible deployment environment.

The use of PM2 with a `pm2 startup` hook ensures application availability beyond active SSH sessions, addressing a key requirement for a continuously accessible web service. Nginx as a reverse proxy provides a clean single-port access point on port 80 and decouples the web server layer from the application processes.

Future improvements would include migrating image storage to AWS S3 for durability and scalability, adding HTTPS via Let's Encrypt for secure connections, implementing rate limiting on authentication endpoints to prevent brute-force attacks, and allocating an Elastic IP on EC2 to avoid the public IP changing on instance restarts.

Overall, this project provided hands-on exposure to the real-world challenges of deploying and maintaining a full-stack web application in a cloud environment, reinforcing the value of automation, environment parity, and process management in a software delivery pipeline.

---

## License

MIT

