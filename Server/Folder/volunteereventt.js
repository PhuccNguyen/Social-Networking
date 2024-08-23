import express from "express";
import { createEvent, getEvents, getEventById, signupForEvent } from "../controllers/admin.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create a new volunteer event
router.post("/", verifyToken, createEvent);

// Get all volunteer events
router.get("/", getEvents);

// Get a single volunteer event by ID
router.get("/:id", getEventById);

// Sign up for a volunteer event
router.post("/signup", verifyToken, signupForEvent);

export default router;
