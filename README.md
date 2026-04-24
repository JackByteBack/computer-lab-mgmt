# 🖥️ Computer Lab Management System

A full-stack web app to track computer usage, software licenses, and maintenance for college computer labs.

---

## 🗂️ Project Structure

```
computer-lab-mgmt/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── computerController.js  # Computer CRUD + stats
│   │   ├── softwareController.js  # License CRUD + expiry check
│   │   ├── maintenanceController.js # Ticket CRUD
│   │   └── usageController.js     # Sessions, login/logout
│   ├── middleware/
│   │   └── auth.js                # JWT middleware
│   ├── models/
│   │   ├── Computer.js
│   │   ├── SoftwareLicense.js
│   │   ├── Maintenance.js
│   │   └── UsageSession.js
│   ├── routes/
│   │   ├── computers.js
│   │   ├── software.js
│   │   ├── maintenance.js
│   │   └── usage.js
│   ├── server.js                  # Express app entry point
│   ├── seeder.js                  # Seed dummy data
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── css/
    │   └── style.css
    └── js/
        └── api.js                 # API helper + utilities
├── index.html                     # Dashboard
├── computers.html                 # Computer management
├── software.html                  # License management
├── maintenance.html               # Ticket tracker
└── usage.html                     # Usage sessions log
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- npm

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set your MONGO_URI
```

### 3. Seed the Database (optional but recommended)

```bash
node seeder.js
```

This creates 32 computers, 7 software licenses, and 6 maintenance tickets.

### 4. Start the Backend Server

```bash
npm run dev     # development (nodemon)
npm start       # production
```

Server runs on: `http://localhost:5001`

### 5. Open the Frontend

Open `index.html` in your browser (via Live Server in VS Code or any static file server).

---

## 🌐 API Endpoints

### Computers

| Method | Endpoint                       | Description       |
| ------ | ------------------------------ | ----------------- |
| GET    | `/api/computers`               | Get all computers |
| GET    | `/api/computers/:id`           | Get one computer  |
| POST   | `/api/computers`               | Add computer      |
| PUT    | `/api/computers/:id`           | Update computer   |
| PATCH  | `/api/computers/:id/status`    | Update status     |
| DELETE | `/api/computers/:id`           | Delete computer   |
| GET    | `/api/computers/stats/summary` | Stats overview    |

### Software Licenses

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/software`          | All licenses            |
| GET    | `/api/software/expiring` | Expiring within 30 days |
| POST   | `/api/software`          | Add license             |
| PUT    | `/api/software/:id`      | Update license          |
| DELETE | `/api/software/:id`      | Delete license          |

### Maintenance

| Method | Endpoint                         | Description   |
| ------ | -------------------------------- | ------------- |
| GET    | `/api/maintenance`               | All tickets   |
| POST   | `/api/maintenance`               | Create ticket |
| PUT    | `/api/maintenance/:id`           | Update ticket |
| DELETE | `/api/maintenance/:id`           | Delete ticket |
| GET    | `/api/maintenance/stats/summary` | Ticket stats  |

### Usage Sessions

| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| GET    | `/api/usage`             | All sessions       |
| POST   | `/api/usage/login`       | Start session      |
| POST   | `/api/usage/logout/:id`  | End session        |
| GET    | `/api/usage/top-users`   | Top users by hours |
| GET    | `/api/usage/daily-stats` | Hourly usage today |

---

## 🛠️ Tech Stack

| Layer        | Technology                       |
| ------------ | -------------------------------- |
| Backend      | Node.js + Express.js             |
| Database     | MongoDB + Mongoose               |
| Frontend     | HTML5, CSS3, Vanilla JS          |
| Architecture | MVC (Models, Views, Controllers) |
| Auth Ready   | JWT (jsonwebtoken + bcryptjs)    |

---

## 🎯 Features

- ✅ Visual 8×4 lab floor map with real-time PC status
- ✅ Full CRUD for computers, licenses, tickets, sessions
- ✅ Software license expiry alerts and seat usage tracking
- ✅ Maintenance ticket system with priority and assignee
- ✅ Usage session logging — login/logout with duration
- ✅ Top users report via MongoDB aggregation
- ✅ Search and filter across all pages
- ✅ Toast notifications, modals, responsive sidebar
- ✅ Auto ticket ID generation (TKT-001, TKT-002...)
- ✅ Auto license status calculation based on expiry

---

## 📝 Notes

- The frontend calls `http://localhost:5001/api` — make sure backend is running before opening pages.
- To use with MongoDB Atlas, replace `MONGO_URI` in `.env` with your Atlas connection string.
- Auth middleware is included in `middleware/auth.js` — add `protect` to any route to require JWT.

# computer-lab-mgmt
