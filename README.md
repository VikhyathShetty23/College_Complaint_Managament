# College Complaint Management System

##  Description

A full-stack web application that allows students to submit complaints and track their status. Complaints are categorized by departments and managed efficiently.

---

## Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Node.js, Express
* **Database:** MySQL

---

## Features

* Submit complaints
* View all complaints
* Edit and delete complaint
* Update complaint status (Pending → Resolved)
* Department-based classification

---

## Project Structure

* frontend/ → React UI
* routes/ → API routes
* server.js → Backend entry
* db.js → MySQL connection
* schema.sql → Database schema

---

## How to Run

### 1. Clone the repository

git clone https://github.com/VikhyathShetty23/College_Complaint_Managment

### 2. Backend setup

npm install<br>
node server.js

### 3. Frontend setup

cd frontend
npm install<br>
npm run dev

### 4. Database

Run schema.sql in MySQL

---

## Environment Variables

Create a `.env` file:

DB_HOST=localhost <br>
DB_USER=root <br>
DB_PASSWORD=yourpassword <br>
DB_NAME=complaint_system <br>
PORT=5000

---

## Future Improvements

* Admin dashboard
* Authentication system
* Email notifications
