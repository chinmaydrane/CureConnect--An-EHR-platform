import express from "express";
import dotenv from "dotenv";
// Load env vars
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js"
import aiRoutes from "./routes/aiRoutes.js";
import accessRoutes from "./routes/accessRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import appointmentsRouter from "./routes/appointmentRoutes.js";
import blockchainRoutes from './routes/blockchain.js';
import { Server } from "socket.io";
import http from "http";



// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// app.use((req, res, next) => {
//   console.log("🌐 Incoming:", req.method, req.url);
//   next();
// });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const roomState = {};
const roomReadyCount = {};

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    // First user becomes initiator
    if (!roomState[roomId]) {
      roomState[roomId] = socket.id;
    }

    const role = roomState[roomId] === socket.id ? "initiator" : "receiver";
    socket.emit("role", role);

    console.log(`👥 ${socket.id} joined ${roomId} as ${role}`);
  });

  socket.on("ready-for-call", (roomId) => {
    roomReadyCount[roomId] = (roomReadyCount[roomId] || 0) + 1;

    if (roomReadyCount[roomId] === 2) {
      io.to(roomId).emit("both-ready");
      console.log(`✅ Both users ready in ${roomId}`);
    }
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    // Cleanup rooms
    for (const roomId in roomState) {
      if (roomState[roomId] === socket.id) {
        delete roomState[roomId];
        delete roomReadyCount[roomId];
      }
    }
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/appointments", appointmentsRouter);
app.use('/api/blockchain', blockchainRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("CureConnect Backend is running...");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
