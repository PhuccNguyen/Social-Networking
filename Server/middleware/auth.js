import jwt from "jsonwebtoken";

// Verify Token Middleware
export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ error: "Access Denied: No Token Provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.substring(7, token.length).trimLeft();
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;  // Attach the verified user info to the request object
    next();

  } catch (err) {
    // Handle token errors such as expiration
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token Expired" });
    }
    res.status(500).json({ error: "Invalid Token" });
  }
};

// Verify Role Middleware (dynamic)
export const verifyRole = (roles) => (req, res, next) => {
  const user = req.user;
  if (!roles.includes(user.role)) {
    return res.status(403).json({ message: "Forbidden: Insufficient Role" });
  }
  next();
};

// Admin Role Verification
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin role required" });
  }
  next();
};

// Assistant Admin Role Verification
export const verifyAssistantAdmin = (req, res, next) => {
  if (req.user.role !== "assistantAdmin" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Assistant Admin role required" });
  }
  next();
};
