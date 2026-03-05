# 🎮 Quest Store – Game Key Marketplace

A full-stack web application for buying and selling premium game keys. Features admin dashboard, user authentication, favorites system, shopping cart, and order management.

---

## 📋 Overview

**Quest Store** is a modern e-commerce platform built with Node.js, Express, EJS, and SQLite. The application is separated into two independent servers:

- **Frontend Server** (Port 5500): User interface with EJS templates
- **Backend API Server** (Port 3010): RESTful API with CORS support

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser/Client                       │
└────────────────────────┬────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────┐            ┌──────────────────┐
│  Frontend Server │            │ Backend API      │
│  (Port 5500)     │            │ (Port 3010)      │
│                  │            │                  │
│ - EJS Templates  │            │ - REST API       │
│ - Static Files   │            │ - Database Sync  │
│ - OAuth/Auth     │            │ - CORS Enabled   │
│ - Page Routing   │            │                  │
└────────┬─────────┘            └────────┬─────────┘
         │                               │
         │          Axios Calls          │
         │─────────────────────────────▶ │
         │                               │
         │         JSON Responses        │
         │ ◀─────────────────────────────│
         │                               │
         └───────────────────┬───────────┘
                             │
                        ▼
                   ┌─────────────────┐
                   │  SQLite DB      │
                   │                 │
                   │ - users         │
                   │ - games         │
                   │ - categories    │
                   │ - orders        │
                   │ - cart          │
                   │ - favorites     │
                   └─────────────────┘
```

---

## 🎯 Project Structure

```
quest-store/
├── backend.js                    # Backend API Server
├── frontend.js                   # Frontend Server
├── server.js                     # Original Single Server (Deprecated)
├── package.json
├── .env                          # Environment Configuration
├── README.md
│
├── src/
│   ├── models/                   # Database Models (Sequelize)
│   │   ├── index.js
│   │   ├── users.js
│   │   ├── games.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   ├── orderDetails.js
│   │   ├── cart.js
│   │   ├── favorites.js
│   │   ├── gameKeys.js
│   │
│   ├── controllers/              # Business Logic
│   │   ├── pageController.js
│   │   ├── usersController.js
│   │   ├── gamesController.js
│   │   ├── categoriesController.js
│   │   ├── ordersController.js
│   │   ├── cartController.js
│   │   ├── favoritesController.js
│   │
│   ├── routes/                   # Route Handlers
│   │   ├── pagesRoute.js
│   │   └── api/
│   │       ├── usersRoute.js
│   │       ├── gamesRoute.js
│   │       ├── categoriesRoute.js
│   │       ├── ordersRoute.js
│   │       ├── cartRoute.js
│   │       ├── favoritesRoute.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT Authentication & Auth Guards
│   │
│   ├── database/
│   │   ├── database.sqlite       # SQLite Database File
│   │   └── seed.js               # Database Seeding
│   │
│   ├── views/                    # EJS Templates
│   │   ├── layout.ejs            # Main Layout
│   │   ├── admin-layout.ejs      # Admin Layout
│   │   ├── home.ejs
│   │   ├── login.ejs
│   │   ├── profile.ejs
│   │   ├── cart.ejs
│   │   ├── checkout.ejs
│   │   ├── game-details.ejs
│   │   ├── about.ejs
│   │   ├── 404.ejs
│   │   ├── admin/
│   │   │   ├── dashboard.ejs
│   │   │   ├── users.ejs
│   │   │   ├── categories.ejs
│   │   │   ├── games.ejs
│   │   │   ├── orders.ejs
│   │   │   ├── reports.ejs
│   │   │
│   │   └── partials/
│   │       ├── header.ejs
│   │       ├── footer.ejs
│   │       └── game-card.ejs
│   │
│   └── public/                   # Static Assets
│       ├── css/
│       │   ├── style.css
│       │   └── theme.css
│       ├── js/
│       │   ├── app.js
│       │   ├── login.js
│       │   ├── toast.js
│       │
│       │
│       └── images/
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v14+
- npm v6+
- Git Bash (for running commands on Windows)
- SQLite3

### Installation

1. **Clone or extract the project:**

   ```bash
   cd quest-store
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   The `.env` file is included with default settings:

   ```env
   # Backend Configuration
   BACKEND_PORT=3010
   BACKEND_URL=http://localhost:3010

   # Frontend Configuration
   FRONTEND_PORT=5500
   FRONTEND_URL=http://localhost:5500

   # Database
   DB_NAME=database.sqlite

   # JWT
   JWT_SECRET=your-secret-key-change-this
   ```

4. **Seed the database (optional):**

   ```bash
   npm run seed
   ```

   This populates sample data:
   - Categories
   - Games
   - Users (admin + normal users)
   - Sample orders

---

## 🏃 Running the Application

### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev
```

This starts:

- 🎨 Frontend on `http://localhost:5500`
- 📡 Backend on `http://localhost:3010`

### Option 2: Run Servers Separately

**Terminal 1 - Backend API:**

```bash
npm run dev:backend
```

- Backend API runs on `http://localhost:3010`
- Use `/health` endpoint to verify: `http://localhost:3010/health`

**Terminal 2 - Frontend:**

```bash
npm run dev:frontend
```

- Frontend runs on `http://localhost:5500`

---

## 🌐 Available URLs

### Frontend

| URL                                      | Description         |
| ---------------------------------------- | ------------------- |
| `http://localhost:5500/`                 | Home Page           |
| `http://localhost:5500/login`            | Login Page          |
| `http://localhost:5500/cart`             | Shopping Cart       |
| `http://localhost:5500/checkout`         | Checkout            |
| `http://localhost:5500/profile`          | User Profile        |
| `http://localhost:5500/about`            | About Page          |
| `http://localhost:5500/admin`            | Admin Dashboard     |
| `http://localhost:5500/admin/users`      | User Management     |
| `http://localhost:5500/admin/categories` | Category Management |
| `http://localhost:5500/admin/games`      | Game Management     |
| `http://localhost:5500/admin/orders`     | Order Management    |
| `http://localhost:5500/admin/reports`    | Reports             |

### Backend API

| Method         | Endpoint                | Description             |
| -------------- | ----------------------- | ----------------------- |
| GET            | `/health`               | Health check            |
| **Users**      |
| POST           | `/api/users/register`   | User registration       |
| POST           | `/api/users/login`      | User login              |
| GET            | `/api/users/me`         | Get current user        |
| GET            | `/api/users`            | Get all users (Admin)   |
| **Games**      |
| GET            | `/api/games`            | Get all games           |
| GET            | `/api/games/:id`        | Get game details        |
| POST           | `/api/games`            | Create game (Admin)     |
| PUT            | `/api/games/:id`        | Update game (Admin)     |
| DELETE         | `/api/games/:id`        | Delete game (Admin)     |
| **Categories** |
| GET            | `/api/categories`       | Get all categories      |
| POST           | `/api/categories`       | Create category (Admin) |
| PUT            | `/api/categories/:id`   | Update category (Admin) |
| DELETE         | `/api/categories/:id`   | Delete category (Admin) |
| **Cart**       |
| GET            | `/api/cart`             | Get user's cart         |
| POST           | `/api/cart`             | Add game to cart        |
| DELETE         | `/api/cart/:gameId`     | Remove from cart        |
| DELETE         | `/api/cart`             | Clear cart              |
| POST           | `/api/cart/checkout`    | Checkout                |
| **Favorites**  |
| GET            | `/api/favorites`        | Get user's favorites    |
| POST           | `/api/favorites/toggle` | Toggle favorite         |
| **Orders**     |
| GET            | `/api/orders`           | Get user's orders       |
| GET            | `/api/orders/:id`       | Get order details       |

---

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication.

### Login Flow

1. User logs in via `/login`
2. Frontend sends credentials to `POST /api/users/login`
3. Backend returns JWT token
4. Token is stored in HTTP-Only cookie
5. All subsequent requests include token in headers/cookies

### User Roles

- **Admin**: Full access to all admin features
- **User**: Can browse, buy games, and manage cart/favorites

### Default Admin Account (After Seeding)

```
Email: admin@example.com
Password: AdminPass123
```

> ⚠️ **Change these credentials in production!**

---

## 🗄️ Database Schema

### Users

```javascript
{
  (id, username, email, password(hashed), role, createdAt, updatedAt);
}
```

### Games

```javascript
{
  (id, title, description, price, category_id, image_url, createdAt, updatedAt);
}
```

### Categories

```javascript
{
  (id, category_name, slug, description, createdAt, updatedAt);
}
```

### Orders

```javascript
{
  (id, user_id, total_price, status, createdAt, updatedAt);
}
```

### Cart

```javascript
{
  (id, user_id, game_id, quantity, createdAt, updatedAt);
}
```

### Favorites

```javascript
{
  (id, user_id, game_id, createdAt, updatedAt);
}
```

### Game Keys

```javascript
{
  (id, game_id, key_code, is_used, sold_at, user_id, createdAt, updatedAt);
}
```

---

## 🛠️ Technologies Used

### Frontend

- **Express.js** - Web framework
- **EJS** - Template engine
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide Icons** - Icon library

### Backend

- **Express.js** - REST API framework
- **Sequelize** - ORM
- **SQLite3** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-Origin Resource Sharing

### DevTools

- **Nodemon** - Auto-restart on file changes
- **Concurrently** - Run multiple scripts in parallel

---

## 📝 npm Scripts

```bash
npm run dev              # Run both backend & frontend
npm run dev:backend     # Run backend only (port 3010)
npm run dev:frontend    # Run frontend only (port 5500)
npm run seed            # Seed database with sample data
npm test                # Run tests (if configured)
```

---

## 🐛 Troubleshooting

### Issue: "Frontend showing 404 for API calls"

**Solution:**

- Ensure backend is running on port 3010
- Check `.env` file has `BACKEND_URL=http://localhost:3010`
- Verify both `layout.ejs` and `admin-layout.ejs` have axios configuration

### Issue: "CORS errors when calling API"

**Solution:**

- Backend CORS is configured for `http://localhost:5500`
- If running on different host, update `FRONTEND_URL` in `.env`
- Ensure credentials flag is enabled: `axios.defaults.withCredentials = true`

### Issue: "Database file not found"

**Solution:**

```bash
npm run seed  # Creates and populates database.sqlite
```

### Issue: "JWT token invalid"

**Solution:**

- Clear browser cookies and login again
- Check `JWT_SECRET` in `.env` matches on both servers
- Ensure token is sent with `withCredentials: true` in axios

---

## 🔒 Security Notes

⚠️ **Before deploying to production:**

1. Change `JWT_SECRET` in `.env`
2. Update default admin credentials
3. Set `NODE_ENV=production`
4. Use HTTPS instead of HTTP
5. Update CORS origin to your domain
6. Enable rate limiting
7. Hash sensitive data properly
8. Use environment-specific secrets management

---

## 📚 API Documentation

### POST /api/users/login

```javascript
// Request
{
  email: "user@example.com",
  password: "password123"
}

// Response
{
  success: true,
  token: "eyJhbGc...",
  user: { id, username, email, role }
}
```

### POST /api/cart

```javascript
// Request
{
  gameId: 1
}

// Response
{
  success: true,
  message: "Added to cart"
}
```

### POST /api/cart/checkout

```javascript
// Response
{
  success: true,
  orderId: 123,
  message: "Order created successfully"
}
```

---

## 📄 License

ISC License - Feel free to use for personal or commercial projects.

---

## 👤 Author & Team dev

**Max Natchanon** (Techlead & Dev & Project Manager)
**First Poorinut** (Backend Dev & Supporter Frontend)
**Bright Kongpop** (Frontend Dev & UI/UX)
**Bam Napat** (Report & Support other works)

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review console errors (F12 in browser)
3. Check backend logs in terminal

---

**Last Updated:** March 4, 2026  
**Version:** 2.0.0 (Frontend/Backend Separated)
