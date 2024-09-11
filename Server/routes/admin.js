import express from "express";
import { createEvent } from "../controllers/event.js";
import { updateUserRole } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import { verifyRole } from "../middleware/auth.js";

const router = express.Router();

// Admin and assistantAdmin can create events
router.post("/events", verifyToken, verifyRole(["admin", "assistantAdmin"]), createEvent);

// Only admin can update user roles
router.put("/users/:id/role", verifyToken, verifyRole(["admin"]), updateUserRole);

export default router;
