# 🏥 Hospital Management System

A full-stack web application for managing hospital operations including appointments, doctors, patients, and admin management — built with **Spring Boot** (Backend) and **React** (Frontend).

---

## 📌 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Roles & Access Control](#roles--access-control)
- [Database Configuration](#database-configuration)
- [Future Enhancements](#future-enhancements)

---

## Overview

The **Hospital Management System** is a role-based web application that streamlines hospital workflows. It supports:

- Appointment booking and management
- Doctor and patient registration
- Admin control panel
- JWT-based authentication
- Role-based dashboards (Admin, Doctor, Patient)

---

## Technology Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Backend    | Spring Boot                 |
| Frontend   | React (Vite + JSX)          |
| Database   | MySQL                       |
| ORM        | Spring Data JPA (Hibernate) |
| Security   | Spring Security + JWT       |
| Build Tool | Maven                       |

---

## Features

### 👤 Authentication
- User registration & login
- JWT token-based authentication
- Role-based access: Admin, Doctor, Patient

### 🗓️ Appointment Management
- Book appointments with available doctors
- View appointment history
- Admin can manage all appointments

### 👨‍⚕️ Doctor Management
- Add/update/delete doctor profiles
- View doctor's specialization, fees, and schedule

### 🧑‍💼 Admin Panel
- Manage doctors and patients
- View and update appointment statuses
- Full system control

### 🏥 Patient Dashboard
- View personal appointments
- Book new appointments with doctors

---

## Project Structure

```
hospital/
├── hospital/                    # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/hospital/
│   │       │   ├── controller/
│   │       │   ├── service/
│   │       │   ├── repository/
│   │       │   ├── entity/
│   │       │   ├── security/
│   │       │   └── HospitalApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── Hospital-frontend/           # React Frontend
    └── hospital-frontend/
        ├── src/
        │   ├── components/
        │   ├── pages/
        │   └── App.jsx
        └── package.json
```

---

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- MySQL Server
- Maven

---

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/hospital-management-system.git
   cd hospital-management-system/hospital
   ```

2. **Configure the database** in `src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hospital_db
   spring.datasource.username=root
   spring.datasource.password=yourpassword
   spring.jpa.hibernate.ddl-auto=update
   ```

3. **Run the backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start at: `http://localhost:8080`

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd Hospital-frontend/hospital-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will start at: `http://localhost:5173`

---

## API Endpoints

### Authentication
| Method | Endpoint              | Description       |
| ------ | --------------------- | ----------------- |
| POST   | `/auth/login`         | Login user        |
| POST   | `/auth/register`      | Register new user |

### Doctors
| Method | Endpoint              | Description          |
| ------ | --------------------- | -------------------- |
| GET    | `/api/doctors`        | Get all doctors      |
| POST   | `/api/doctors`        | Add a new doctor     |
| PUT    | `/api/doctors/{id}`   | Update doctor info   |
| DELETE | `/api/doctors/{id}`   | Delete a doctor      |

### Appointments
| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| GET    | `/api/appointments`           | Get all appointments    |
| POST   | `/api/appointments`           | Book an appointment     |
| PUT    | `/api/appointments/{id}`      | Update appointment      |
| DELETE | `/api/appointments/{id}`      | Delete appointment      |

### Patients
| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/patients`       | Get all patients      |
| GET    | `/api/patients/{id}`  | Get patient by ID     |

---

## Roles & Access Control

| Role    | Permissions                                        |
| ------- | -------------------------------------------------- |
| Admin   | Full access: manage doctors, patients, appointments |
| Doctor  | View own appointments, update appointment status   |
| Patient | Book appointments, view own appointment history    |

---

## Database Configuration

The application uses **MySQL**. Create a database before starting:

```sql
CREATE DATABASE hospital_db;
```

Default seeded accounts (via `DataSeeder`):

| Role    | Email                   | Password  |
| ------- | ----------------------- | --------- |
| Admin   | admin@hospital.com      | admin123  |
| Doctor  | doctor@hospital.com     | doctor123 |
| Patient | patient@hospital.com    | patient123|

---

## Future Enhancements

- 📧 Email notifications for appointments
- 💳 Online payment for consultancy fees
- 📊 Analytics dashboard for admin
- 🔔 Real-time notifications
- 📱 Mobile-responsive PWA

---

## License

This project is developed for educational/hackathon purposes.

---

> Built with ❤️ using Spring Boot + React
