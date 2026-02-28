🚀 SkillSwap Market

A Peer-to-Peer Skill Exchange Platform for College Students

📌 Overview

SkillSwap Market is a peer-to-peer skill exchange platform built for college students to learn, teach, and grow together using an in-app coin economy.

Instead of paying money, students exchange skills using virtual coins.
Users can:

👨‍🏫 Teach a skill

👨‍🎓 Learn a skill

🪙 Earn coins by teaching

💸 Spend coins to learn

👥 Connect with college friends

The platform encourages collaborative learning and builds a strong student learning ecosystem within a college.

🎯 Problem Statement

College students possess diverse skills but lack:

A structured platform to teach peers

An incentive system for sharing knowledge

Easy discovery of who can teach what

Skill exchange without financial barriers

Traditional learning platforms:

Are expensive

Lack peer connection

Do not focus on internal college networks

💡 Solution

SkillSwap Market solves this by:

Creating a college-based skill marketplace

Allowing students to list themselves as Teachers and/or Learners

Introducing a virtual coin system

Making skill exchange gamified and fair

Encouraging peer-to-peer mentorship

🏗️ Features
🔐 Authentication

Secure Login / Signup

JWT-based authentication

College-restricted access (only same college users)

👤 User Profiles

View college friends

Profile includes:

Skills they can teach

Skills they want to learn

Coin balance

Availability

📚 Skill Listings

Users can:

Add skill as Teacher

Add skill as Learner

Set coin cost per session

Update or delete skills

🔄 Skill Exchange System

Learner sends request

Teacher accepts

Coins deducted from learner

Coins credited to teacher

Session marked completed

🪙 In-App Coin Economy

Initial coin balance for every new user

Earn coins by teaching

Spend coins by learning

Fully internal virtual currency system

👥 College-Based Networking

Only college students can join

Discover friends from same college

Encourages internal community building

🛠️ Tech Stack
Frontend

React.js

Tailwind CSS

React Router

Axios

React Query

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Deployment

Frontend: Vercel / Base44

Backend: Render

Database: MongoDB Atlas

🧱 System Architecture
Frontend (React)
      ↓
API Layer (Axios)
      ↓
Backend (Node + Express)
      ↓
MongoDB (Database)
🗂️ Project Structure
skillswap-market/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   └── App.jsx
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── README.md
🧩 Database Schema
User Model
{
  name: String,
  email: String,
  password: String,
  college: String,
  coins: Number,
  skillsTeaching: [Skill],
  skillsLearning: [Skill]
}
Skill Model
{
  title: String,
  description: String,
  category: String,
  coinCost: Number,
  owner: ObjectId
}
Transaction Model
{
  learner: ObjectId,
  teacher: ObjectId,
  skill: ObjectId,
  coinsTransferred: Number,
  status: String
}
🚀 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/yourusername/skillswap-market.git
cd skillswap-market
2️⃣ Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key

Run server:

npm run dev
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev
🔐 Environment Variables
Backend .env
PORT=
MONGO_URI=
JWT_SECRET=
Frontend .env
VITE_API_BASE_URL=
🎮 How It Works (User Flow)

User signs up

Gets initial coin balance

Adds skills they can teach

Adds skills they want to learn

Browses college users

Sends learning request

Teacher accepts

Coins automatically transferred

Session marked complete

👨‍💻 Team
Built with passion for collaborative learning ❤️
