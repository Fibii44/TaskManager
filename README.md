<p align="center">
    <img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="300" alt="Laravel Logo">
</p>

# 📝 TaskHub - Advanced Task Management System

**TaskHub** is a high-performance, real-time task management application built with the **Laravel (PHP)** backend and a polished **React (Inertia.js)** frontend. It features a unique "Individual Progress" system where tasks are only completed once every assigned team member finishes their part.

## 🚀 Key Features

- **Individual Status Tracking**: Uses a custom pivot table logic where each assigned user has their own `pending` or `completed` status.
- **Real-Time Updates**: Integrated with **Laravel Echo** to refresh the UI instantly across all users when progress is made.
- **Big & Wide UI**: A modern, spacious dashboard design built with **Material UI (MUI)** for maximum readability.
- **Role-Based Access**:
    - **Admins**: Create, Edit, Delete, and Assign tasks to multiple employees.
    - **Employees**: Manage their personal progress and toggle their specific task status.
- **Advanced UX**:
    - Interactive **Team Progress Bars**.
    - **Drag and Drop** task reordering (for Admins).
    - Status badges and checkmark indicators for assigned team members.

## 🛠️ Tech Stack

- **Backend**: Laravel 10 (PHP 8.2)
- **Frontend**: React.js via Inertia.js
- **Database**: MySQL (System Data) & Pivot Progress Tracking
- **UI Framework**: Material UI (MUI)
- **Real-Time**: Laravel Echo & Pusher/Soketi
- **Validation**: Custom FormRequests (`StoreTaskRequest`, `UpdateTaskRequest`)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/task-manager.git](https://github.com/yourusername/task-manager.git)
   cd task-manager