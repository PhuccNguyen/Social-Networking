import express from 'express';
import {
    createEvent,
    registerForEvent,
} from "../controllers/event.js";
import { verifyToken, verifyRole } from '../middleware/auth.js';

const router = express.Router();

// Create an event (admin or assistantAdmin only)
router.post("/create", verifyToken, verifyRole(["admin", "assistantAdmin"]), createEvent);

// Register for an event (all users can register)
router.post("/register", verifyToken, registerForEvent);

export default router;
