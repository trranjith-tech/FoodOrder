# Problem Statement

## 1. Title

**Online Food Ordering System**

## 2. Domain

**FoodTech / Online Food Delivery**

## 3. Who is the user? (2-3 user types, with roles)

### 1. Customer

The customer is the primary user of the system. Customers can register and log in to the application, browse available restaurants, view food menus, add food items to their cart, place orders, and track the status of their orders.

### 2. Restaurant Admin

The restaurant admin manages the restaurant's food menu and customer orders. The restaurant admin can add, update, and remove menu items, view incoming orders, accept or reject orders, and update the status of orders.

### 3. System Admin

The system admin manages the overall application. The system admin can manage registered users and restaurants and monitor the overall operation of the system.

## 4. What problem are we solving? (3-5 sentences, real-life example)

Traditional food ordering methods can be inconvenient for customers because they may need to contact restaurants directly or visit restaurants to place orders. Customers may also find it difficult to browse available food items, compare menu options, and know the current status of an order. Restaurants can face difficulties in manually managing customer orders, updating menu items, and tracking order progress. The proposed Online Food Ordering System provides a centralized platform where customers can browse menus, place orders, and track their orders, while restaurants can efficiently manage menus and incoming orders.

## 5. Proposed Solution (what the application will do, feature-wise)

The Online Food Ordering System will be a full-stack web application that connects customers with restaurants through a single platform.

### Customer Features

* Customer registration and login
* Secure user authentication
* Browse available restaurants
* View restaurant information
* Browse food categories
* View available food items
* Add food items to cart
* Update food quantities in cart
* Remove items from cart
* Place food orders
* View order details
* View previous orders
* Track order status
* Logout securely

### Restaurant Admin Features

* Restaurant admin login
* Manage restaurant information
* Add new food items
* Update food item details
* Remove unavailable food items
* Manage food categories
* View incoming customer orders
* Accept or reject orders
* Update order status
* View order history

### System Admin Features

* Admin login
* Manage customers
* Manage restaurants
* Monitor system activities
* Manage application-level data

### Core Business Flow

Customer:

Register/Login → Browse Restaurant → View Menu → Add Food to Cart → Checkout → Place Order → Track Order

Restaurant:

Login → Manage Menu → Receive Order → Accept/Reject Order → Prepare Order → Update Order Status

## 6. Core Entities / Database Tables

The system will use the following database tables:

### 1. User

Stores customer, restaurant admin, and system admin account information.

**Important fields:**

* user_id
* name
* email
* password
* role
* phone

### 2. Restaurant

Stores information about restaurants available in the system.

**Important fields:**

* restaurant_id
* restaurant_name
* address
* contact_number
* status

### 3. Category

Stores food categories such as Pizza, Burger, Indian Food, Beverages, and Desserts.

**Important fields:**

* category_id
* category_name
* description

### 4. MenuItem

Stores food items offered by restaurants.

**Important fields:**

* menu_item_id
* restaurant_id
* category_id
* item_name
* description
* price
* availability

### 5. Cart

Stores the active shopping cart associated with a customer.

**Important fields:**

* cart_id
* user_id
* created_at
* updated_at

### 6. CartItem

Stores the individual food items added to a customer's cart.

**Important fields:**

* cart_item_id
* cart_id
* menu_item_id
* quantity
* price

### 7. Order

Stores customer order information.

**Important fields:**

* order_id
* user_id
* restaurant_id
* order_date
* total_amount
* order_status

### 8. OrderItem

Stores the individual food items included in an order.

**Important fields:**

* order_item_id
* order_id
* menu_item_id
* quantity
* price

### 9. Payment

Stores payment-related information for an order.

**Important fields:**

* payment_id
* order_id
* payment_method
* payment_status
* transaction_reference

## 7. User Roles & Permissions

| Role                 | Permissions                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Customer**         | Register, login, browse restaurants, view menus, manage cart, place orders, view order history, track orders |
| **Restaurant Admin** | Login, manage restaurant menu, manage categories, view orders, accept/reject orders, update order status     |
| **System Admin**     | Manage users, manage restaurants, monitor application data                                                   |

The system will enforce role-based access so that users can only access functionality permitted for their role.

## 8. Success Criteria

The project will be considered successful when:

1. A customer can successfully register and log in to the system.
2. A customer can browse available restaurants and view their menus.
3. A customer can add food items to a cart and modify the cart.
4. A customer can successfully place an order.
5. A customer can view their order history and current order status.
6. A restaurant admin can add, update, and remove menu items.
7. A restaurant admin can view incoming customer orders.
8. A restaurant admin can accept/reject orders and update their status.
9. The application provides secure authentication and role-based access.
10. The complete application can be deployed and accessed through a public URL.

## 9. Out of Scope

The following features are outside the initial scope of this 60-day capstone project:

* Real-time GPS tracking of delivery personnel
* Managing a fleet of delivery vehicles
* Advanced restaurant accounting
* Payroll management
* International food delivery
* Multi-country tax calculation
* Real-world cash collection management
* Advanced logistics and route optimization
* Building a native Android/iOS application
* Integration with real banking systems

Third-party services or advanced features may be considered later if they are appropriate for the project's enhancement phase.

## 10. Chosen Track

**Java Track — Spring Boot**

### Technology Stack

* **Frontend:** React.js
* **Styling:** Bootstrap / Tailwind CSS
* **Backend:** Spring Boot 3.x
* **Programming Language:** Java 17
* **Authentication:** Spring Security + JWT
* **ORM:** Spring Data JPA + Hibernate
* **Database:** MySQL 8
* **Build Tool:** Maven
* **Testing:** JUnit 5
* **API Documentation:** Swagger / OpenAPI
* **Version Control:** Git + GitHub
* **CI/CD:** GitHub Actions
* **Backend Hosting:** Render / Railway
* **Frontend Hosting:** Vercel / Netlify

### Expected API Structure

The application will expose REST APIs under:

`/api/`

API responses will follow a consistent structure such as:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```
### Initial Project Scope

The primary goal of this project is to develop a secure and modular online food ordering platform that demonstrates the complete Software Development Life Cycle, including problem analysis, system design, development, testing, deployment, and future enhancement.