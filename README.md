# Notes App - Web Technologies 2 (Backend) Assignment 3
<img width="1881" height="906" alt="image" src="https://github.com/user-attachments/assets/5a953a53-5276-4485-87e5-d7bd5ef2c9de" />


A full-stack CRUD application for managing notes with MongoDB Atlas integration.

## 📋 Project Overview

This project is a RESTful API backend for a Notes App built with Node.js, Express.js, and MongoDB. It includes a simple frontend interface for interacting with the API and demonstrates complete CRUD operations for both Notes and Tags.

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB installation)
- Git (optional)

## Postman Test Screenshots
<img width="1256" height="836" alt="image" src="https://github.com/user-attachments/assets/0952a380-bde9-4528-b34f-3d43aab5eebd" />
<img width="1298" height="869" alt="image" src="https://github.com/user-attachments/assets/68fdf92c-be88-4a93-b2d5-7cdbfff62e5f" />
<img width="1099" height="838" alt="image" src="https://github.com/user-attachments/assets/19e76f05-34c6-488a-a2e4-5934ab67b8f0" />
<img width="1242" height="864" alt="image" src="https://github.com/user-attachments/assets/8dde3049-fedd-42f2-97b3-c71b4f563c6b" />
<img width="830" height="640" alt="image" src="https://github.com/user-attachments/assets/b45ed8ed-e64a-494e-a051-2eb2ab722669" />
<img width="1069" height="822" alt="image" src="https://github.com/user-attachments/assets/1b05b3ae-5abd-41fe-a6fc-0dcd1c59aded" />
<img width="1231" height="873" alt="image" src="https://github.com/user-attachments/assets/2d639456-d72c-46c5-afb1-842dd20fa84e" />
<img width="1310" height="845" alt="image" src="https://github.com/user-attachments/assets/578868eb-53b1-4bc0-952e-14a605cffc48" />
<img width="1039" height="609" alt="image" src="https://github.com/user-attachments/assets/0ba53087-e7b6-43f2-82ce-c712b0a2d5dd" />



### Installation Steps

1. **Navigate to project directory**

```bash
cd WT3
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notesapp?retryWrites=true&w=majority&appName=YourAppName
```

Replace:

- `username` - Your MongoDB Atlas username
- `password` - Your MongoDB Atlas password
- `cluster` - Your cluster address
- `notesapp` - Your database name
- `YourAppName` - Your app name

For local MongoDB:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notesapp
```

4. **Run the application**

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

5. **Access the application**

- Frontend Interface: http://localhost:3000
- API Endpoint: http://localhost:3000/api

## 📁 Project Structure

```
WT3/
├── config/
│   └── database.js              # MongoDB connection configuration
├── models/
│   ├── Note.js                  # Note schema with validation
│   └── Tag.js                   # Tag schema with validation
├── routes/
│   ├── noteRoutes.js            # RESTful routes for notes
│   └── tagRoutes.js             # RESTful routes for tags
├── controllers/
│   ├── noteController.js        # Business logic for notes CRUD
│   └── tagController.js         # Business logic for tags CRUD
├── middleware/
│   ├── validateNote.js          # Request validation for notes
│   ├── validateTag.js           # Request validation for tags
│   └── errorHandler.js          # Global error handling
├── public/
│   ├── index.html               # Frontend user interface
│   ├── css/
│   │   └── style.css           # Application styling
│   └── js/
│       └── app.js              # Frontend JavaScript logic
├── utils/
│   └── validateObjectId.js      # MongoDB ObjectId validation helper
├── .env                         # Environment variables (create this)
├── .gitignore                   # Git ignore file
├── package.json                 # Project dependencies and scripts
├── app.js                       # Main application entry point
└── README.md                    # This file
```

## 📡 API Endpoints

### Notes Endpoints

| Method | Endpoint         | Description                           | Status Codes                           |
| ------ | ---------------- | ------------------------------------- | -------------------------------------- |
| POST   | `/api/notes`     | Create a new note                     | 201 Created, 400 Bad Request           |
| GET    | `/api/notes`     | Get all notes (with optional filters) | 200 OK                                 |
| GET    | `/api/notes/:id` | Get single note by MongoDB ID         | 200 OK, 404 Not Found                  |
| PUT    | `/api/notes/:id` | Update existing note by ID            | 200 OK, 404 Not Found, 400 Bad Request |
| DELETE | `/api/notes/:id` | Delete note by ID                     | 200 OK, 404 Not Found                  |

### Query Parameters for GET /api/notes

- `category` - Filter by category (Work, Personal, Ideas, Study, Todo, Other)
- `isPinned` - Filter by pinned status (true/false)
- `search` - Full-text search in title and content

**Example:**

```
GET /api/notes?category=Work&isPinned=true
```

### Tags Endpoints

| Method | Endpoint        | Description          | Status Codes                           |
| ------ | --------------- | -------------------- | -------------------------------------- |
| POST   | `/api/tags`     | Create a new tag     | 201 Created, 400 Bad Request           |
| GET    | `/api/tags`     | Get all tags         | 200 OK                                 |
| GET    | `/api/tags/:id` | Get single tag by ID | 200 OK, 404 Not Found                  |
| PUT    | `/api/tags/:id` | Update tag by ID     | 200 OK, 404 Not Found, 400 Bad Request |
| DELETE | `/api/tags/:id` | Delete tag by ID     | 200 OK, 404 Not Found                  |

## 🧪 Testing with Postman

### 1. Create a Note

```http
POST http://localhost:3000/api/notes
Content-Type: application/json

{
  "title": "Learn MongoDB",
  "content": "Study MongoDB aggregation pipeline and indexing",
  "category": "Study",
  "isPinned": true,
  "color": "#4CAF50"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Learn MongoDB",
    "content": "Study MongoDB aggregation pipeline and indexing",
    "category": "Study",
    "isPinned": true,
    "color": "#4CAF50",
    "tags": [],
    "createdAt": "2026-01-18T10:00:00.000Z",
    "updatedAt": "2026-01-18T10:00:00.000Z"
  }
}
```

### 2. Get All Notes

```http
GET http://localhost:3000/api/notes
```

**Response (200 OK):**

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Learn MongoDB",
      "content": "Study MongoDB aggregation pipeline",
      "category": "Study",
      "isPinned": true,
      "color": "#4CAF50",
      "tags": [],
      "createdAt": "2026-01-18T10:00:00.000Z",
      "updatedAt": "2026-01-18T10:00:00.000Z"
    }
  ]
}
```

### 3. Get Single Note

```http
GET http://localhost:3000/api/notes/60f7b3b3b3b3b3b3b3b3b3b3
```

### 4. Update a Note

```http
PUT http://localhost:3000/api/notes/60f7b3b3b3b3b3b3b3b3b3b3
Content-Type: application/json

{
  "title": "Master MongoDB",
  "content": "Complete MongoDB certification",
  "category": "Study",
  "isPinned": false,
  "color": "#2196F3"
}
```

### 5. Delete a Note

```http
DELETE http://localhost:3000/api/notes/60f7b3b3b3b3b3b3b3b3b3b3
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {},
  "message": "Note deleted successfully"
}
```

### 6. Create a Tag

```http
POST http://localhost:3000/api/tags
Content-Type: application/json

{
  "name": "urgent",
  "color": "#FF5722"
}
```

### 7. Filter Notes

```http
GET http://localhost:3000/api/notes?category=Work
GET http://localhost:3000/api/notes?isPinned=true
GET http://localhost:3000/api/notes?search=MongoDB
```

## Validation Rules

### Note Validation

- **Title**: Required, max 100 characters, trimmed
- **Content**: Required, trimmed
- **Category**: Required, must be one of: Work, Personal, Ideas, Study, Todo, Other
- **Color**: Optional, must be valid hex color code (#RRGGBB)
- **isPinned**: Optional, boolean value
- **Tags**: Optional, array of valid MongoDB ObjectIds

### Tag Validation

- **Name**: Required, unique, max 30 characters, automatically converted to lowercase
- **Color**: Optional, must be valid hex color code (#RRGGBB), defaults to #3b82f6

### Error Response Format

```json
{
  "success": false,
  "errors": [
    "Title is required",
    "Category must be one of: Work, Personal, Ideas, Study, Todo, Other"
  ]
}
```

Or for single errors:

```json
{
  "success": false,
  "error": "Note not found"
}
```

## 🔧 Error Handling

The API uses proper HTTP status codes and returns consistent error responses:

| Status Code | Meaning                                            |
| ----------- | -------------------------------------------------- |
| 200         | Success (GET, PUT, DELETE)                         |
| 201         | Created (POST)                                     |
| 400         | Bad Request (validation errors, invalid ID format) |
| 404         | Not Found (resource doesn't exist)                 |
| 500         | Server Error (database errors, unexpected errors)  |

### Error Types Handled:

- **Validation Errors**: Missing required fields, invalid data formats
- **Duplicate Key Errors**: Attempting to create duplicate unique values
- **Cast Errors**: Invalid MongoDB ObjectId format
- **Not Found Errors**: Resource doesn't exist in database
- **Database Connection Errors**: MongoDB connection issues

## 🛠️ Technologies Used

### Backend

- **Node.js** - Runtime environment
- **Express.js v5.2.1** - Web framework
- **Mongoose v9.1.3** - MongoDB ODM
- **dotenv v17.2.3** - Environment variable management
- **CORS v2.8.5** - Cross-Origin Resource Sharing

### Frontend

- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript** - Client-side logic and API interaction

### Database

- **MongoDB Atlas** - Cloud-hosted NoSQL database

### Development Tools

- **Nodemon v3.1.11** - Auto-restart server during development
- **Postman** - API testing

## 📊 Database Schema

### Note Schema

```javascript
{
  title: String (required, max 100 chars),
  content: String (required),
  category: String (required, enum),
  isPinned: Boolean (default: false),
  color: String (hex format, default: #ffffff),
  tags: [ObjectId] (ref: Tag),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Tag Schema

```javascript
{
  name: String (required, unique, lowercase, max 30 chars),
  color: String (hex format, default: #3b82f6),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```
