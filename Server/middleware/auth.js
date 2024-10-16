// import jwt from "jsonwebtoken";


// export const verifyToken = async (req, res, next) => {
//   try {
//     let token = req.header("Authorization");

//     if (!token) {
//       return res.status(403).json({ error: "Access Denied: No Token Provided" });
//     }

//     // Remove "Bearer" from the token if it's present
//     if (token.startsWith("Bearer ")) {
//       token = token.slice(7, token.length).trim();
//     }

//     // Verify the token
//     const verified = jwt.verify(token, process.env.JWT_SECRET);

//     if (!verified) {
//       return res.status(401).json({ error: "Invalid Token" });
//     }

//     req.user = verified;  // Attach the verified user info to the request object
//     next();

//   } catch (err) {
//     console.error("Token Verification Error:", err.message);
//     if (err.name === 'TokenExpiredError') {
//       return res.status(401).json({ error: "Token Expired" });
//     }
//     return res.status(500).json({ error: "Failed to verify token" });
//   }
// };





// // Verify Role Middleware (dynamic)
// export const verifyRole = (roles) => (req, res, next) => {
//   const user = req.user;
//   if (!roles.includes(user.role)) {
//     return res.status(403).json({ message: "Forbidden: Insufficient Role" });
//   }
//   next();
// };

// // Admin Role Verification
// export const verifyAdmin = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Admin role required" });
//   }
//   next();
// };

// export const verifyAssistantAdmin = (req, res, next) => {
//   console.log("User role in request:", req.user.role);  // Add a log to check the role in the middleware
//   if (req.user.role !== "assistantAdmin" && req.user.role !== "admin") {
//     return res.status(403).json({ message: "Assistant Admin or Admin role required" });
//   }
//   next();
// };


