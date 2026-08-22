# CleanCarbon & Intelligent Waste Collection System (Integrated)

This repository unifies the **CleanCarbonTracks** Next.js frontend with the **Intelligent Waste Collection System** FastAPI backend into a single cohesive platform.

---

## 🏗 System Architecture

```
integrated_waste_system/
├── frontend/             # Next.js 14, React 18, Tailwind CSS, TypeScript
├── backend/              # FastAPI, Python 3, Waste Network, Image Classifier, Route Router
├── package.json          # Unified npm workspace scripts
├── .gitignore            # Clean git ignore for both Node & Python
└── README.md
```

### Components
1. **Frontend (Next.js)**:
   - **Smart Waste Categorizer**: AI-driven waste identification, bin color mapping, & carbon offset calculations.
   - **Resident Portal**: On-demand doorstep pickup scheduling and complaint filing.
   - **Worker/Driver View**: Real-time duty status, pickup job inbox, proof of completion upload.
   - **Admin Dashboard**: Live telemetry, vehicle fleet tracking, and municipal analytics.

2. **Backend (FastAPI)**:
   - **Image Classifier**: Taxonomy-driven rule engine for campus & urban waste streams (`wet`, `dry`, `hazardous`, `ewaste`).
   - **Waste Network**: Access control, duty tracking, job inbox dispatching, proof-of-work validation.
   - **Route Router**: Intelligent field job router & geofencing validation.
   - **API Services**: Session authentication, report creation, analytics telemetry, photo serving.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18 or later
- **Python**: 3.9 or later

### Installation

1. **Install Frontend & Root Dependencies**:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

---

## 🏃 Running the Application

### Option A: Run Both Simultaneously (Recommended)
From the root directory:
```bash
npm run dev
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000`
- **Backend API Docs (Swagger UI)**: `http://localhost:8000/docs`

---

### Option B: Run Services Separately

1. **Start Backend Server**:
   ```bash
   npm run dev:backend
   # OR
   cd backend && python run_web.py
   ```

2. **Start Frontend Server**:
   ```bash
   npm run dev:frontend
   # OR
   cd frontend && npm run dev
   ```

---

## 🧪 Testing

- **Backend PyTest Suite**:
  ```bash
  npm run test:backend
  ```

- **Frontend Next.js Build**:
  ```bash
  npm run build:frontend
  ```

---

## 🔗 Integrated API Endpoints

| Method | Endpoint | Description |
| shadow | --- | --- |
| `POST` | `/api/session` | Sign in as Citizen or Worker |
| `GET`  | `/api/categorize?item=...` | AI Waste Stream Classification & Bin Rules |
| `POST` | `/api/citizen/reports` | Submit Citizen Waste Report with Photo & GPS |
| `GET`  | `/api/worker/dashboard` | Worker Job Inbox & Field Assignments |
| `POST` | `/api/worker/jobs/{job_id}/complete` | Submit Job Completion Proof |
| `GET`  | `/api/analytics` | Environmental & Fleet Analytics Telemetry |
| `GET`  | `/api/vehicles` | Real-time Fleet Status & Battery Metrics |
