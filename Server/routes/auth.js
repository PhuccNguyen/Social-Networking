import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router(); // Corrected `route` to `router`

router.post("/login", login); // Using `router` instead of `route`

export default router; // Exporting `router` instead of `route`
