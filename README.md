# 🚀 Task Manager App (Full Stack)

A **role-based task management mobile application** built using **React Native (Expo)** for the frontend and **Node.js, Express, MongoDB** for the backend.

---

## 📱 Features

### 🔐 Authentication

* User Signup & Login
* JWT-based authentication
* Secure password hashing (bcrypt)

### 👥 Role-Based Access

* **Admin**

  * Create tasks
  * Edit tasks
  * Delete tasks
  * View all tasks
* **User**

  * View assigned tasks
  * Update task status (complete)

---

### 📋 Task Management

* Create, Read, Update, Delete (CRUD)
* Status tracking (Pending / Completed)
* Role + ownership validation

---

## 🏗️ Tech Stack

### Frontend (Mobile)

* React Native (Expo)
* Axios
* AsyncStorage
* React Navigation

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication

---

## 📂 Project Structure

```
TaskManager/
├── backend/
│   ├── modules/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   └── server.js
│
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   ├── services/
│   │   └── utils/
│   └── App.js
```

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Run server:

```bash
npm run dev
```

---

### 📱 Frontend Setup

```bash
cd mobile
npm install
npm start
```

Update API URL inside:

```
mobile/src/services/api.js
```

---

## 🔌 API Endpoints

### Auth

* `POST /api/auth/signup`
* `POST /api/auth/login`

### Tasks

* `GET /api/tasks`
* `POST /api/tasks` (Admin)
* `PUT /api/tasks/:id/status`
* `PUT /api/tasks/:id` (Admin)
* `DELETE /api/tasks/:id` (Admin)

---

## 🔐 Security Highlights

* JWT authentication
* Role-based authorization
* Ownership validation for task updates
* Environment variables for secrets

---

## 🎯 Key Highlights

* Clean modular backend architecture (Controller → Service → DB)
* Role-based UI rendering on frontend
* Proper error handling with custom AppError
* Production-level separation of concerns

---

## 🧠 What I Learned

* Designing scalable backend architecture
* Implementing authentication & authorization
* Handling real-world edge cases (double clicks, invalid access)
* Integrating frontend with backend APIs

---

## 📌 Future Improvements

* Pagination & filtering
* Notifications
* UI enhancements (animations, better UX)
* Admin dashboard (web)

---

## 👨‍💻 Author

Hemanth Kumar

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
