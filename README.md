# Notes App - Assignment 4

A full-stack Notes application with authentication, role-based access control (RBAC), admin panel, and CRUD operations for multiple resources.

## 🎯 Project Overview

This project is a complete Notes Application built with:
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt for password hashing
- **Frontend**: Vanilla JavaScript, HTML5, CSS3

## ✨ Features

- ✅ User Registration & Login with JWT
- ✅ Password hashing with bcrypt
- ✅ Role-Based Access Control (Admin/User)
- ✅ Admin Panel with full CRUD for all resources
- ✅ User-specific notes (each user sees only their notes)
- ✅ Categories & Tags management
- ✅ Beautiful landing page for non-authenticated users
- ✅ Modern responsive UI design

## 📦 Models (Objects)

### 1. User Model
**Fields:**
- `email` - String (required, unique, validated)
- `password` - String (required, hashed with bcrypt)
- `role` - Enum: "user", "admin" (default: "user")
- `createdAt`, `updatedAt` - Timestamps

### 2. Note Model (Primary Object)
**Fields:**
- `userId` - Reference to User (required)
- `title` - String (required, max 100 characters)
- `content` - String (required)
- `category` - Enum: Work, Personal, Ideas, Study, Todo, Other
- `isPinned` - Boolean (default: false)
- `color` - Hex color code (default: #ffffff)
- `tags` - Array of Tag references
- `createdAt`, `updatedAt` - Timestamps

### 3. Category Model (Secondary Object)
**Fields:**
- `name` - String (required, unique, max 50 characters)
- `description` - String (max 200 characters)
- `color` - Hex color code (default: #3b82f6)
- `icon` - Emoji icon (default: 📂)
- `createdAt`, `updatedAt` - Timestamps

### 4. Tag Model
**Fields:**
- `name` - String (required, unique, max 30 characters)
- `color` - Hex color code (default: #3b82f6)
- `createdAt`, `updatedAt` - Timestamps

## 👥 User Roles & Access Control (RBAC)

### Roles:
1. **User** (default role)
   - Can register and login
   - Can CRUD their **own** notes only
   - Can view categories and tags (read only)

2. **Admin**
   - All user permissions
   - Full CRUD on all users
   - Full CRUD on all notes (any user's)
   - Full CRUD on categories
   - Full CRUD on tags
   - Access to Admin Panel with dashboard

### Access Control Matrix:

| Resource    | GET | POST | PUT | DELETE |
|-------------|-----|------|-----|--------|
| **Auth** | Public | Public | - | - |
| **Notes** | Auth (own) | Auth | Auth (owner) | Auth (owner) |
| **Categories** | Public | Admin | Admin | Admin |
| **Tags** | Public | Admin | Admin | Admin |
| **Admin Panel** | Admin | Admin | Admin | Admin |

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd WT4
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

4. Seed the database:
```bash
# Create default categories
npm run seed:categories

# Create admin user
node scripts/createAdmin.js
```

5. Start the server:
```bash
npm run dev
# or
npm start
```

The server will start on `http://localhost:3000`

## 🔑 Admin Credentials

```
Email: bauka@gmail.com
Password: baukagoi
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login & get token | Public |
| GET | `/api/auth/me` | Get current user | Auth |

### Notes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/notes` | Get user's notes | Auth |
| GET | `/api/notes/:id` | Get single note | Auth (owner) |
| POST | `/api/notes` | Create note | Auth |
| PUT | `/api/notes/:id` | Update note | Auth (owner) |
| DELETE | `/api/notes/:id` | Delete note | Auth (owner) |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get single category | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Tags
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/tags` | Get all tags | Public |
| GET | `/api/tags/:id` | Get single tag | Public |
| POST | `/api/tags` | Create tag | Admin |
| PUT | `/api/tags/:id` | Update tag | Admin |
| DELETE | `/api/tags/:id` | Delete tag | Admin |

### Admin Panel API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Get stats & recent activity |
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/users/:id` | Get single user |
| PUT | `/api/admin/users/:id` | Update user (role, email) |
| DELETE | `/api/admin/users/:id` | Delete user & their notes |
| GET | `/api/admin/notes` | Get ALL users' notes |
| DELETE | `/api/admin/notes/:id` | Delete any note |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |
| POST | `/api/admin/tags` | Create tag |
| PUT | `/api/admin/tags/:id` | Update tag |
| DELETE | `/api/admin/tags/:id` | Delete tag |

## 📁 Project Structure (MVC Pattern)

```
WT4/
├── app.js                    # Application entry point
├── package.json
├── .env                      # Environment variables
│
├── config/
│   └── database.js           # MongoDB connection
│
├── controllers/
│   ├── adminController.js    # Admin CRUD operations
│   ├── authController.js     # Auth logic (register, login)
│   ├── categoryController.js
│   ├── noteController.js
│   └── tagController.js
│
├── middleware/
│   ├── authenticate.js       # JWT verification & RBAC
│   ├── errorHandler.js       # Global error handler
│   ├── validateCategory.js
│   ├── validateNote.js
│   └── validateTag.js
│
├── models/
│   ├── Category.js
│   ├── Note.js
│   ├── Tag.js
│   └── User.js               # With bcrypt password hashing
│
├── routes/
│   ├── adminRoutes.js        # Admin panel routes
│   ├── authRoutes.js
│   ├── categoryRoutes.js
│   ├── noteRoutes.js
│   └── tagRoutes.js
│
├── scripts/
│   ├── createAdmin.js        # Create admin user
│   ├── makeAdmin.js          # Promote user to admin
│   └── seedCategories.js     # Seed default categories
│
├── utils/
│   └── validateObjectId.js
│
└── public/                   # Frontend
    ├── index.html            # Main app with landing page
    ├── admin.html            # Admin panel
    ├── css/
    │   ├── style.css         # Main styles
    │   └── admin.css         # Admin panel styles
    └── js/
        ├── app.js            # Main app logic
        └── admin.js          # Admin panel logic
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt with configurable salt rounds
2. **JWT Authentication**: Secure token-based auth (7 days expiry)
3. **Role-Based Access Control**: Admin and User roles
4. **Input Validation**: Server-side validation middleware
5. **Error Handling**: Centralized error handler
6. **Protected Routes**: Middleware guards for authenticated routes

## 🖥️ Frontend Pages

### 1. Landing Page (/)
- Hero section with app description
- Features showcase
- Sign In / Register buttons
- Shown to non-authenticated users

### 2. Dashboard (/)
- Sidebar with navigation
- Notes grid with CRUD operations
- Filter by category and tags
- Pin/unpin notes
- Color-coded notes
- Admin panel link (for admins)

### 3. Admin Panel (/admin.html)
- Dashboard with stats
- Users management table
- Notes management (all users)
- Categories CRUD
- Tags CRUD

## 🧪 Testing with Postman

### 1. Register a User
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

### 2. Login
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@test.com",
  "password": "password123"
}
```

### 3. Create a Note
```http
POST http://localhost:3000/api/notes
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content",
  "category": "Work"
}
```

### 4. Admin - Get All Users
```http
GET http://localhost:3000/api/admin/users
Authorization: Bearer <admin-token>
```

## 📜 NPM Scripts

```bash
npm start           # Start production server
npm run dev         # Start with nodemon (development)
npm run seed:categories  # Seed default categories
npm run make:admin  # Promote user to admin (npm run make:admin email@example.com)
```

## 👨‍💻 Author

**Bauka** - Web Technologies 2, Assignment 4

---

© 2025 NotesApp. All rights reserved.
