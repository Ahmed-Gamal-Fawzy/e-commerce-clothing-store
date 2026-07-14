# 🛒 Clothing Store E-Commerce API (Node.js & MongoDB)

A production-ready, enterprise-grade RESTful API for a clothing store e-commerce platform built using Node.js, Express, and MongoDB (Mongoose). It features advanced database filtering, automated image uploading, secure authentication, role-based access control, and atomic inventory management.

---

## 🚀 Core Architectural Features

### 1. Secure Authentication & RBAC
* Fully implemented **JWT Authentication** (Sign up, Log in).
* Password hashing using **bcrypt**.
* **Role-Based Access Control (RBAC)** restricting sensitive operations (like product creation/deletion) to Authorized Admins only.

### 2. Product Management
* Advanced query capabilities: Full-text **Search**, deep multi-field **Sorting**, and dynamic **Pagination**.
* Advanced price range filtering using MongoDB mathematical comparison operators.

### 3. Smart File Uploads (Multer Integration)
* Automated local image uploading for product catalog using **Multer**.
* Integrated dynamic directory creation (`fs`) on-the-fly to prevent environment failures.

### 4. Persistence Shopping Cart
* Interactive cart persistence bound directly to the authenticated user.
* Dynamic quantity stacking for duplicate items and real-time total price calculations.

### 5. Order Tracking & Atomic Restocking
* High-integrity checkout pipeline with automated multi-phase inventory validation to prevent dirty writes.
* Safe **Order Cancellation** endpoint supporting real-time **Stock Restocking** back to the database catalog.

---

## 🗺️ Visual API Documentation Map

Here is the structured roadmap of all available endpoints. You can test these endpoints using the provided Postman collection.

### 🔑 Authentication & Users
| Method | Endpoint | Description | Access Control |
| :---: | :--- | :--- | :---: |
| 🟢 `POST` | `/api/users/signup` | Register a new user account | **Public** |
| 🟢 `POST` | `/api/users/login` | Authenticate user & receive JWT Bearer Token | **Public** |

### 📂 Category Management
| Method | Endpoint | Description | Access Control |
| :---: | :--- | :--- | :---: |
| 🔵 `GET` | `/api/categories` | Retrieve list of all clothing categories | **Public** |
| 🟢 `POST` | `/api/categories` | Create a new category | **Admin Only** |

### 👕 Product Catalog
| Method | Endpoint | Description | Access Control |
| :---: | :--- | :--- | :---: |
| 🔵 `GET` | `/api/products` | Get products (Supports Search, Filtering, Pagination) | **Public** |
| 🔵 `GET` | `/api/products/:id` | Get details of a single product | **Public** |
| 🟢 `POST` | `/api/products` | Create product (Supports **Multer** image upload) | **Admin Only** |
| 🟡 `PUT` | `/api/products/:id` | Update product details or stock | **Admin Only** |
| 🔴 `DELETE` | `/api/products/:id` | Remove product from store catalog | **Admin Only** |

### 🛒 Shopping Cart
| Method | Endpoint | Description | Access Control |
| :---: | :--- | :--- | :---: |
| 🔵 `GET` | `/api/cart` | Retrieve current user's persistent cart | **User / Admin** |
| 🟢 `POST` | `/api/cart` | Add / stack an item to the shopping cart | **User / Admin** |
| 🔴 `DELETE` | `/api/cart/:itemId` | Remove a specific item from the cart | **User / Admin** |

### 📦 Order & Inventory Control
| Method | Endpoint | Description | Access Control |
| :---: | :--- | :--- | :---: |
| 🟢 `POST` | `/api/orders` | Checkout cart, create order, deduct stock | **User / Admin** |
| 🔵 `GET` | `/api/orders/my-orders` | Retrieve order history for logged-in user | **User / Admin** |
| 🟡 `PATCH` | `/api/orders/:id/status` | Update order status (Pending, Shipped, Delivered) | **Admin Only** |
| 🟣 `PATCH` | `/api/orders/:id/cancel` | Cancel order & **Restock** items automatically | **User (Owner) / Admin** |

---

## 🛠️ Tech Stack
* **Backend Runtime:** Node.js, Express.js
* **Database & ODM:** MongoDB, Mongoose ODM
* **Input Validation:** Joi
* **File Uploads:** Multer (Local Storage)

---

## 🏁 Getting Started

### Prerequisites
* Node.js installed locally.
* MongoDB running instance (Local or Atlas).

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Ahmed-Gamal-Fawzy/e-commerce-clothing-store.git](https://github.com/Ahmed-Gamal-Fawzy/e-commerce-clothing-store.git)
   cd e-commerce-clothing-store
