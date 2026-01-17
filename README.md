# 🩺 Cure-Connect     
**AI-Powered Secure Telemedicine & Healthcare Management Platform**

Cure-Connect is a full-stack healthcare platform that connects **patients, doctors, and hospital administrators** through secure appointment booking, protected medical data handling, AI-powered assistance, blockchain-secured document storage, and **real-time video consultations**.

The platform is designed with a strong focus on **security, scalability, data privacy, and real-world WebRTC communication**, making it suitable for modern telemedicine and digital hospital ecosystems.

---

## 🚀 Live Demo
- **Frontend (Vercel):** https://cure-connect-pink.vercel.app  
- **Backend:** Deployed on Render
- **Diet ML Service (Flask):** Deployed separately on Render

---

## 📌 Problem Statement
Traditional healthcare systems face several limitations:
- Inefficient appointment scheduling
- Lack of real-time patient–doctor interaction
- Insecure handling of medical documents and reports
- No intelligent assistance for patients
- Poor administrative visibility at hospital level

**Cure-Connect** solves these issues by providing a **secure, AI-driven, role-based healthcare platform** with real-time communication and analytics.

---

## Stakeholders & Roles

### 👤 Patient
- Book appointments using Doctor ID
- Join real-time video consultations
- View prescriptions, vitals, and summaries
- Use AI Health Assistant
- Get AI-powered diet recommendations (text, documents & ML-based)

### 🧑‍⚕️ Doctor
- View today’s patient queue
- Access patient data only for booked appointments
- Join video consultations
- View and summarize patient reports using Patient ID
- Upload reports and prescriptions via Cloudinary (with patient consent)

### 🏥 Admin (Hospital-Level)
- Access all doctors and patients under the hospital
- View analytics dashboards and graphs
- Monitor uploaded reports, vitals, and prescriptions
- Manage hospital-wide healthcare data securely

Each **hospital has its own admin**, ensuring **data isolation and privacy**.

---

## ✨ Key Features

### Appointment Management
- Secure appointment booking using **Doctor ID**
- Unique `appointmentId` generated for each booking
- Separate dashboards for patient and doctor
- Appointment-based isolated video call rooms

---

### Video Consultation (WebRTC)
- Peer-to-peer real-time video & audio calls
- Camera and microphone on/off controls
- Works across **different devices and networks**
- Uses **STUN + TURN (Metered)** for NAT/firewall traversal

---

### AI Health Assistant
- Built using **Google Gemini**
- Handles only health-related queries
- Supports **text-based medical questions**
- Multilingual Support for both text based and voice based queries.
- Assists patients with general health guidance

---

### AI Diet Assistant
- AI-powered personalized diet recommendations(text + documents)
- Users can **upload medical reports (PDF / images)**
- Uses **OCR (Tesseract)** to extract text
- Extracted data is analyzed using **Gemini AI**
- Diet plans are generated based on medical conditions

### ML-Based Diet Prediction Engine (Flask + LightGBM)
- A custom-trained **LightGBM Regressor model**
- Trained on a dataset of **5000+ records**
- Deployed separately as a **Flask microservice**
- Integrated with frontend and backend

---

### Medical Report Handling
- Upload reports (Lab reports, prescriptions, vitals)
- OCR used for text extraction from documents
- AI-generated summaries for doctors and patients
- Reports are **secured using blockchain hashing**
- Ensures **data integrity and tamper resistance**

---

### Blockchain Integration
- Medical reports are hashed and stored on blockchain
- Ensures:
  - Integrity of reports
  - No unauthorized modifications
  - Trust between patient, doctor, and hospital
- Blockchain used as a **verification layer**, not for raw file storage

---

### Admin Analytics Dashboard
- Visual graphs and charts for:
  - Total doctors
  - Total patients
  - Uploaded lab reports
  - Prescriptions and vitals
- Helps hospital admins monitor operational health
- Built using aggregated backend data APIs

---

### Security & Privacy
- JWT-based authentication
- Role-based access control (Patient / Doctor / Admin)
- Appointment-level authorization
- Secure CORS configuration for production
- No exposure of TURN or API secrets on frontend

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Socket.IO Client
- WebRTC
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication

### AI & Processing
- Google Gemini API
- Tesseract OCR
- OCR-based document parsing
- LightGBM Regressor
- Flask (ML microservice)

### Deployment & Services
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas
- Cloudinary (Report storage)
- Metered.ca (TURN / STUN servers)

---

## ⚙️ Environment Variables

### Backend `.env`
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your cloud name
CLOUDINARY_API_KEY=your key
CLOUDINARY_API_SECRET=your secret
GEMINI_API_KEY=your key
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FLASK_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_TURN_USERNAME=your name
NEXT_PUBLIC_TURN_CREDENTIAL=your key
```

---
## Contact
For any queries or suggestions, feel free to reach out:
- **Name**: Vedant Nikam
- **Email**: [nikam.vedant05@gmail.com]
- **GitHub**: [https://github.com/Vednik123](https://github.com/Vednik123)






