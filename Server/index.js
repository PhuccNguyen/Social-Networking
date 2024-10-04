import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/post.js";
import eventsRoutes from "./routes/event.js";
import adminRoutes from "./routes/admin.js";
import friendRoutes from "./routes/friend.js"; 
// import volunteerEventRoutes from "./Folder/volunteereventt.js"; 

import { createPost } from "./controllers/post.js";
import { register } from "./controllers/auth.js";
import { verifyToken } from './middleware/auth.js';
// import User  from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js"


// Load environment variables from .env file
dotenv.config(); 


// Configurations for __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
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


// Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);
app.use("/event", eventsRoutes);
app.use("/admin", adminRoutes);
app.use("/friends", friendRoutes); // Sử dụng route "/friends"


// app.use("/volunteer-events", volunteerEventRoutes); 
// Add volunteer event routes


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