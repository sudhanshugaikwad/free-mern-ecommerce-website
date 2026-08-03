# 🛒 eKart – MERN Stack E-Commerce Website

> A modern, full-stack E-Commerce website built with the MERN Stack featuring JWT Authentication, OTP Email Verification, Razorpay Payment Integration, Cloudinary Image Uploads, and a powerful Admin Dashboard.

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Status](https://img.shields.io/badge/Status-Active-success)

---

## 🌐 Live Demo

🚀 **Live Website**

https://free-mern-ecommerce-website-frontend.onrender.com/

---

## 📂 GitHub Repository

https://github.com/sudhanshugaikwad/mern-ecommerce-website

---

# 📌 Project Overview

eKart is a complete MERN Stack E-Commerce application that provides a modern online shopping experience.

The application includes secure authentication, OTP email verification, product management, shopping cart, Razorpay payment gateway, order management, and a professional admin dashboard with sales analytics.

---

# ✨ Features

## 👤 User Features

- User Registration & Login
- JWT Authentication
- OTP Email Verification
- Secure Password Encryption
- Browse Products
- Product Details Page
- Search Products
- Add to Cart
- Update Cart Quantity
- Remove Cart Items
- User Profile Management
- Order History
- Razorpay Secure Payment
- Responsive Design

---

## 🛠️ Admin Features

- Admin Authentication
- Manage Users
- Add Products
- Edit Products
- Delete Products
- Upload Product Images
- Manage Orders
- Manage Payments
- Update Order Status
- Dashboard Analytics
- Sales Reports using Recharts

---

# 🛠️ Tech Stack

## Frontend

- React.js (Vite)
- Redux Toolkit
- Tailwind CSS
- Shadcn UI
- React Router DOM
- Axios
- Recharts
- React Medium Image Zoom

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Nodemailer
- Multer
- Cloudinary
- DataURI

## Payment Gateway

- Razorpay

## Additional Features

- Protected Routes
- OTP Email Verification
- CORS
- Environment Variables
- Cloudinary Image Upload

---

# 📁 Project Structure

```text
eKart
│
├── Frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   ├── layouts
│   │   ├── redux
│   │   ├── hooks
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
│
├── Backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── utils
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── README.md
├── LICENSE
└── .gitignore
```

---

# 🔐 Authentication

- JWT Authentication
- Protected Routes
- Password Hashing (bcrypt)
- OTP Email Verification
- Role Based Authorization
- Admin Access

---

# 💳 Payment Integration

- Razorpay Payment Gateway
- Secure Checkout
- Payment Verification
- Automatic Order Creation

---

# 📊 Admin Dashboard

- Total Users
- Total Products
- Total Orders
- Total Revenue
- Monthly Sales Analytics
- Recent Orders
- Revenue Charts

---

# 📦 API Modules

### Authentication

- Register
- Login
- Logout
- Verify OTP

### Users

- User Profile
- Update Profile

### Products

- Get Products
- Product Details
- Add Product
- Update Product
- Delete Product

### Cart

- Add Item
- Update Quantity
- Remove Item
- Get Cart

### Orders

- Create Order
- View Orders
- Update Order Status

### Payments

- Create Razorpay Order
- Verify Payment

### Admin

- Dashboard Statistics
- Manage Users
- Manage Products
- Manage Orders

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/sudhanshugaikwad/mern-ecommerce-website.git
```

Move into the project

```bash
cd mern-ecommerce-website
```

---

## Install Frontend

```bash
cd Frontend
npm install
npm run dev
```

---

## Install Backend

```bash
cd Backend
npm install
npm run dev
```

---

# 🔑 Environment Variables

## Backend (.env)

```env
PORT=
MONGODB_URI=
JWT_SECRET=

EMAIL_USER=
EMAIL_PASS=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

# 🚀 Future Improvements

- Product Reviews
- Wishlist
- Coupon System
- Inventory Management
- Product Ratings
- Email Notifications
- SMS Notifications
- Dark Mode
- Multi-language Support

---

# 👨‍💻 Developer

**Sudhanshu Gaikwad**

MERN Stack Developer

### GitHub

https://github.com/sudhanshugaikwad

### LinkedIn

https://www.linkedin.com/in/sudhanshugaikwad

---

# ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future improvements.

---

## 📄 License

This project is licensed under the MIT License.
