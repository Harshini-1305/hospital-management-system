# **Hospital Management System – Design Document**

---

## **1. Introduction**

### **1.1 Purpose**

This document provides a comprehensive design overview of the *Hospital Management System* based on the provided project. It describes the system architecture, components, data flow, and implementation details to help developers, stakeholders, and reviewers understand the system clearly.

### **1.2 Scope**

The system is a full-stack web application designed to:

* Manage doctors and patients
* Handle appointment booking and tracking
* Enforce role-based access (Admin, Doctor, Patient)
* Track consultancy fees and appointment statuses
* Provide REST APIs for frontend integration

---

## **2. System Overview**

### **2.1 System Type**

* Web-based application
* Client-Server Architecture

### **2.2 Technology Stack**

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Backend    | Spring Boot                 |
| Frontend   | React (Vite + JSX-based UI) |
| Database   | MySQL                       |
| ORM        | Spring Data JPA (Hibernate) |
| Security   | Spring Security + JWT       |
| Build Tool | Maven                       |

---

## **3. Architecture Design**

### **3.1 High-Level Architecture**

```
Frontend (React UI)
        ↓
REST API (Spring Boot Controllers)
        ↓
Service Layer (Business Logic)
        ↓
Repository Layer (JPA)
        ↓
Database (MySQL)
```

### **3.2 Layers Description**

#### **1. Controller Layer**

* Handles HTTP requests
* Maps endpoints (`/api/...`, `/auth/...`)
* Validates inputs
* Calls service methods

#### **2. Service Layer**

* Contains business logic
* Implements rules such as:

  * Appointment availability checks
  * Role validation
  * Fee calculation

#### **3. Repository Layer**

* Interface extending JPA repositories
* Handles CRUD operations
* Abstracts database access

#### **4. Entity Layer**

* Represents database tables
* Uses annotations like `@Entity`, `@ManyToOne`, `@OneToMany`

#### **5. Security Layer**

* JWT filter for token validation
* Role-based authorization
* Stateless session management

---

## **4. Functional Requirements**

### **4.1 User Management**

* Register new users (Admin, Doctor, Patient)
* Login authentication
* Role-based access:

  * Admin
  * Doctor
  * Patient

### **4.2 Doctor Management**

* Add doctors
* Update doctor details (specialization, fees)
* Delete doctors
* View all available doctors

### **4.3 Appointment System**

* Book appointment with a doctor
* View appointment history
* Update appointment status (Admin/Doctor)
* Cancel appointments

### **4.4 Consultancy Fee Handling**

* Each doctor has a defined consultancy fee
* Fee is displayed to patients during booking
* Admin can update doctor fees

### **4.5 Patient Management**

* View patient profiles
* Track appointment history per patient
* Admin can manage all patient records

---

## **5. Non-Functional Requirements**

* **Performance:** Fast API responses under load
* **Security:** JWT-based authentication and role-based authorization
* **Scalability:** Modular, layered architecture
* **Maintainability:** Clean separation of concerns
* **Usability:** Intuitive role-specific dashboards

---

## **6. Database Design**

### **6.1 Key Entities**

#### **User**

* id
* name
* email
* password
* role (ADMIN / DOCTOR / PATIENT)

#### **Doctor**

* id
* name
* email
* specialization
* fees
* user\_id (FK)

#### **Patient**

* id
* name
* email
* age
* gender
* user\_id (FK)

#### **Appointment**

* id
* patient\_id (FK)
* doctor\_id (FK)
* appointmentDate
* status (PENDING / CONFIRMED / COMPLETED / CANCELLED)
* notes

---

### **6.2 Relationships**

* One User → One Doctor (optional, if user is a Doctor)
* One User → One Patient (optional, if user is a Patient)
* One Patient → Many Appointments
* One Doctor → Many Appointments

**Reason:**
Each appointment record belongs to:

* One patient
* One doctor

---

## **7. API Design**

### **7.1 Authentication APIs**

* `POST /auth/register`
* `POST /auth/login`

### **7.2 Doctor APIs**

* `GET /api/doctors`
* `POST /api/doctors`
* `PUT /api/doctors/{id}`
* `DELETE /api/doctors/{id}`

### **7.3 Patient APIs**

* `GET /api/patients`
* `GET /api/patients/{id}`
* `PUT /api/patients/{id}`

### **7.4 Appointment APIs**

* `POST /api/appointments`
* `GET /api/appointments`
* `GET /api/appointments/{id}`
* `PUT /api/appointments/{id}`
* `DELETE /api/appointments/{id}`

---

## **8. Business Logic Design**

### **8.1 Appointment Booking Flow**

1. Patient selects a doctor from the list
2. System checks doctor availability
3. Appointment record is created with status PENDING
4. Admin/Doctor confirms the appointment

---

### **8.2 Appointment Status Flow**

```
PENDING → CONFIRMED → COMPLETED
         → CANCELLED
```

---

### **8.3 Role-Based Dashboard Logic**

| Role    | Dashboard Actions                                          |
| ------- | ---------------------------------------------------------- |
| Admin   | Manage doctors, patients, all appointments                 |
| Doctor  | View own appointments, update appointment status           |
| Patient | Book appointments, view own appointment history            |

---

### **8.4 Booking Restrictions**

* Patient cannot book:

  * If no doctors are available
  * If appointment date conflicts

---

## **9. Security Design**

### **9.1 Authentication**

* Email + Password login
* JWT (JSON Web Token) issued on successful login
* Token stored in `localStorage` on the client side
* Token sent in `Authorization: Bearer <token>` header for every protected API

### **9.2 JWT Filter Flow**

```
Request
   ↓
JwtFilter (Extract Token)
   ↓
Validate Token
   ↓
Set SecurityContext (User + Role)
   ↓
Controller Processes Request
```

### **9.3 Authorization**

* Role-based using Spring Security:

  * Admin → Full control
  * Doctor → View/update appointments
  * Patient → Book/view own appointments

---

## **10. UI Design (Frontend)**

### **10.1 Pages**

* Landing / Home Page
* Login / Register
* Admin Dashboard
* Doctor Dashboard
* Patient Dashboard
* Doctor List (with fees)
* Appointment Booking
* Appointment History

### **10.2 Features**

* Dynamic rendering using React (Vite)
* API integration via Fetch / Axios
* Role-based routing with React Router
* Cinematic landing page with animations

---

## **11. Error Handling**

* Validation errors (e.g., missing fields)
* Resource not found (404)
* Unauthorized access (401 / 403)
* JWT expiration errors
* Server errors (500)

---

## **12. Deployment Design**

### **12.1 Backend**

* Runs on configurable port (default: `8080`)
* Packaged as a JAR via Maven

### **12.2 Frontend**

* Runs on Vite development server (default: `5173`)
* Build output can be served via Nginx or any static server

### **12.3 Database**

* Local MySQL instance
* Can be migrated to cloud-based DB (e.g., PlanetScale, AWS RDS)

---

## **13. Future Enhancements**

* Email notifications for appointments
* Online payment for consultancy fees
* Doctor availability scheduling
* Multi-appointment booking
* Real-time notifications (WebSocket)
* Analytics dashboard for admin
* Mobile-responsive PWA

---

## **14. Conclusion**

This Hospital Management System is designed using a clean, modular architecture with clear separation of concerns. It supports real-world use cases like appointment booking, doctor management, role-based access control, and consultancy fee tracking — making it scalable and production-ready with further enhancements.

---
