# FoodRush — Online Food Ordering & Delivery Platform 🍔🚀

A full-stack, production-ready online food delivery web application built with **Spring Boot 3 (Java 17)**, **PostgreSQL**, and **React 18 (Vite + Tailwind CSS)**.

Features dual-role capabilities (Customer & Restaurant Partner), real-time email OTP verification via Gmail SMTP, Swiggy/Zomato-inspired live dish search, interactive cart management, dynamic category filtering, and live order tracking.

---

## 🌟 Key Features

### 👤 Customer Experience
- **Explore & Browse**: 11 curated food categories (Biryani, South Indian, Crispy Chicken, Burgers, Pizza, North Indian, Chinese, Rolls & Wraps, Desserts, Beverages, Chaat).
- **Interactive Live Search**: Instant debounced search for restaurants, cuisines, and specific menu dishes with rich preview popovers.
- **Cart & Dynamic Pricing**: Persistent state cart with delivery fees, taxes, and subtotal calculation.
- **Secure Email OTP Authentication**: 6-digit cryptographic OTP verification for account registration and order placement.
- **Order Tracking**: Visual status timeline tracking orders from Confirmed → Preparing → Out for Delivery → Delivered.

### 🏪 Restaurant Partner Portal
- **Partner Registration & Onboarding**: Seamless onboarding for food vendors and restaurant managers.
- **Menu Management**: Add, update, and toggle item availability (Veg/Non-Veg indicators, pricing, prep times, image previews).
- **Live Order Management**: Real-time order fulfillment workflow with instant status transitions.

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.3.4 (Java 17)
- **Security**: Spring Security 6 + JJWT (JSON Web Token)
- **Database & ORM**: PostgreSQL 18 + Spring Data JPA (Hibernate 6)
- **Email Delivery**: Spring Boot Starter Mail (Jakarta Mail / SMTP)
- **Build Tool**: Apache Maven 3.9+

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom glassmorphism design system
- **State Management**: Zustand (Persisted stores for Auth and Cart)
- **Icons & Motion**: Lucide React + Framer Motion
- **HTTP Client**: Axios with automatic JWT interceptors

---

## 🚀 Getting Started

### Prerequisites
- Java 17+ installed
- PostgreSQL 14+ installed and running
- Node.js 18+ and npm installed
- Maven 3.8+ installed

### 1. Database Setup
Create the PostgreSQL database:
```sql
CREATE DATABASE "online-food-ordering";
```

### 2. Backend Configuration
Copy `.env.example` to your environment or configure `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/online-food-ordering
    username: postgres
    password: YOUR_POSTGRES_PASSWORD
  mail:
    host: smtp.gmail.com
    port: 587
    username: YOUR_EMAIL@gmail.com
    password: YOUR_APP_PASSWORD
```

Run the backend:
```bash
cd backend
mvn spring-boot:run
```
Backend API starts on `http://localhost:8080`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend development server starts on `http://localhost:5173`.

---

## 🛡️ License
This project is licensed under the MIT License.
