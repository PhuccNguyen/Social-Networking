import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import crypto from "crypto";
import http from "http";
import { Server } from "socket.io";

// Import Routes
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/post.js";
import friendRoutes from "./routes/friend.js";
import adminRoutes from "./routes/admin.js";
import volunteerRoutes from "./routes/volunteer.js";
import notificationRoutes from "./routes/notifications.js";

// Import Controllers
import { createPost } from "./controllers/post.js";
import { register } from "./controllers/auth.js";
import { createCampaign } from "./controllers/campaign.js";
import { searchInformation } from "./controllers/search.js";

// Import Middleware
import { verifyToken, verifyAssistantAdmin } from "./middleware/auth.js";

// Load environment variables
dotenv.config();

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Debugging: Check environment variables
console.log("MONGO_URL:", process.env.MONGO_URL);
console.log("PORT:", process.env.PORT);

// File storage (multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    // Generate a unique identifier
    const uniqueSuffix = crypto.randomBytes(8).toString("hex");
    const originalName = path.parse(file.originalname).name; // Get name without extension
    const extension = path.extname(file.originalname); // Get the file extension

    // New filename with unique suffix
    const newFileName = `${originalName}-${uniqueSuffix}${extension}`;
    req.file = { ...req.file, filename: newFileName }; // Store filename in req.file for MongoDB storage

    cb(null, newFileName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});


// Routes with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post("/campaigns", verifyToken, verifyAssistantAdmin, upload.single("imageCampaing"), createCampaign);
app.get("/search", verifyToken, searchInformation);

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes );
app.use("/posts", postsRoutes);
app.use("/friends", verifyToken, friendRoutes);
app.use("/volunteer", volunteerRoutes);
app.use("/admin", adminRoutes);
app.use("/notifications", notificationRoutes);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
  transports: ["websocket", "polling"],
});
// Socket.IO: Track and handle connections
io.onlineUsers = new Map();
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  socket.on("registerUser", (userId) => {
    io.onlineUsers.set(userId, socket.id);

    console.log(`User ${userId} registered for notifications`);
  });

  socket.on("disconnect", () => {
    const userId = Array.from(io.onlineUsers.entries()).find(([_, value]) => value === socket.id)?.[0];
    io.onlineUsers.delete(userId);
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Export Socket.IO instance
export { io };

// Connect to MongoDB and start the server
const PORT = process.env.PORT || 4001;
mongoose.connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log("MongoDB connection successful");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
