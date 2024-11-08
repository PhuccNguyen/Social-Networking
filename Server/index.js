import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import crypto from 'crypto';
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';

  // import notificationRoutes from "./routes/notifications.js"; // Import notification 
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/post.js";
import friendRoutes from "./routes/friend.js"; 
import adminRoutes from "./routes/admin.js"; 
import volunteerRoutes from "./routes/volunteer.js"; 


import { createPost } from "./controllers/post.js";
import { register } from "./controllers/auth.js";
import { createCampaign  } from './controllers/campaign.js';
import { searchInformation } from "./controllers/search.js";
import { verifyToken, verifyAssistantAdmin } from './middleware/auth.js';


// import Post from "./models/Post.js";
// import { users } from "./data/index.js"
// import User  from "./models/User.js";

// Load environment variables from .env file
dotenv.config(); 


// Configurations for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// const server = http.createServer(app); // Create server
// const io = new Server(server, { cors: { origin: '*' } }); // Initialize Socket.IO

// Middleware configurations
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// Debugging: Check if MONGO_URL and PORT are loaded
console.log('MONGO_URL:', process.env.MONGO_URL);
console.log('PORT:', process.env.PORT);

// File storage (multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets"); // Save in the 'public/assets' directory
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



// Routes With Files
app.post("/auth/register", upload.single("picture"), register); // No
app.post("/posts", verifyToken, upload.single("picture"), createPost); // VerifyToken middleware here
app.post('/campaigns', verifyToken, verifyAssistantAdmin, upload.single("imageCampaing"), createCampaign);
app.get('/search', verifyToken, searchInformation);

// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);
app.use("/friends",verifyToken, friendRoutes);
app.use('/volunteer', volunteerRoutes);
app.use('/admin', adminRoutes);
// app.use("/notifications", notificationRoutes); // Notification routes

// // Set up Socket.IO for real-time notifications
// io.onlineUsers = new Map();
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);
//   socket.on('registerUser', (userId) => io.onlineUsers.set(userId, socket.id));
//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     io.onlineUsers.forEach((socketId, userId) => {
//       if (socketId === socket.id) io.onlineUsers.delete(userId);
//     });
//   });
// });

// // Export io for use in controllers
// export { io };

// Mongoose connection
const PORT = process.env.PORT || 4001;
mongoose.connect(process.env.MONGO_URL, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connection successfully!!");
  app.listen(PORT, () => console.log(`Server running on port correct is 3001: ${PORT}`));

  // /* After connect will be ADD DATA form data folder models*/  
  // User.insertMany(users);
  // Post.insertMany(posts);
})
.catch((error) => {
  console.error('Error when connecting to MongoDB Please check your configuration:', error);
});