<div align="center">
 🧘 Doorstep Yoga
 
### Your mat. Your space. Our trainer.
 
**On-demand yoga training — delivered to your doorstep.**
 
Doorstep Yoga connects users with certified yoga trainers who travel to your home, office, or chosen location for personalized, one-on-one sessions. Think *Urban Company meets wellness* — book a trainer in minutes, practice on your own schedule.
 
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-FF6B1A?style=for-the-badge)](https://doorstep-yoga7.vercel.app)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=white)](#)
[![Node](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](#)
 
[**🚀 Try the Live App**](https://doorstep-yoga7.vercel.app) · [Features](#-features) · [Tech Stack](#%EF%B8%8F-tech-stack) · [Getting Started](#-getting-started) · [Roadmap](#-roadmap)
 
</div>
---
 
## 📖 About
 
Doorstep Yoga is a mobile-first, on-demand wellness platform. Users discover nearby certified trainers, filter by specialty and availability, and book a session — at home, in the office, or anywhere they choose. The goal: make personal yoga training as easy to book as a cab.
 
This repo contains the **full-stack MVP**: a React frontend and a Node/Express API, built to validate the core booking flow end-to-end.
 
## ✨ Features
 
| | |
|---|---|
| 🔍 **Trainer Discovery** | Browse and filter certified trainers by specialty, rating, and availability |
| 📅 **Scheduling & Booking** | Pick a time, location, and session type in a few taps |
| 🔐 **OTP Authentication** | Quick, password-free login flow (dummy OTP for demo/testing) |
| 📱 **Mobile-First UI** | Designed for on-the-go booking, optimized for small screens |
| ⚡ **Fast, Typed API** | Express backend with Zod-validated, type-safe endpoints |
 
## 🖼️ Live Demo
 
👉 **[doorstep-yoga7.vercel.app](https://doorstep-yoga7.vercel.app)**
 
> Use any phone number and OTP `123456` (or whatever dummy code is configured) to log in and explore the booking flow.
 
## 🛠️ Tech Stack
 
**Frontend**
- React + TypeScript
- Vite (build tooling)
- React Router (navigation)
**Backend**
- Node.js + Express
- TypeScript
- Zod (schema validation)
**Deployment**
- Vercel (frontend)
## 📂 Project Structure
 
```text
yogfit/
├── frontend/           # React + Vite client
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/             # Express API server
│   ├── src/
│   └── package.json
└── README.md
```
 
## 🚀 Getting Started
 
### Prerequisites
- Node.js (v18+)
- npm
### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/doorstep-yoga.git
cd doorstep-yoga
```
 
### 2. Run the backend
```bash
cd backend
npm install
npm run dev
```
API will start at `http://localhost:<PORT>` (see `backend/.env`).
 
### 3. Run the frontend
```bash
cd frontend
npm install
npm run dev
```
App will be available at `http://localhost:5173`.
 
### Environment Variables
Create a `.env` file in `backend/` (and `frontend/` if needed):
 
```env
# backend/.env
PORT=4000
OTP_BYPASS_CODE=123456
 
# frontend/.env
VITE_API_BASE_URL=http://localhost:4000
```
 
## 🗺️ Roadmap
 
- [ ] Real OTP/SMS provider integration
- [ ] Trainer onboarding & verification flow
- [ ] Payments integration
- [ ] Live trainer location tracking
- [ ] Ratings & reviews
- [ ] Admin dashboard for trainer/session management
## 🤝 Contributing
 
Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a PR.
 
## 📄 License
 
This project is licensed under the MIT License.
 
---
 
<div align="center">
Built with 🧘 for anyone who'd rather skip the studio commute.
 
</div>
