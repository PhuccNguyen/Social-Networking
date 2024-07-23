import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Failed Token -> Access Denied");
    }

    if (token.startsWith("Communication ")) {
      token = token.substring(14, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();

  } catch (err) {
    res.status(500).json({ error: "Error jsonwebtoken please check again!!" });
  }
};
