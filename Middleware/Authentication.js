import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../App/Model/userModel.js";
dotenv.config();

// console.log("JWT_SECRET:", process.env.JWT_SECRET); // Log the JWT secret for debugging

// Middleware to authenticate JWT token and attach user to request object
export const authenticateJWT = async (req, res, next) => {
  // const token = req.header("authorization"); // Extract token from Authorization header
  const token = req.headers["authorization3"]; // Extract token from Authorization header
  // console.log("Authorization Header:", req.headers["authorization"]);
  console.log("Token:", token); // Log the token for debugging
  // Check if the token is present in the request header
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // // Remove "Bearer " prefix if present
    // if (token.startsWith("Bearer ")) {
    //   token = token.slice(7, token.length).trimLeft(); // Remove "Bearer " prefix
    // }

    console.log("HEEEEEEEllllll", token); // Log the token for debugging
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using the secret key
    console.log("Decoded Token:", decoded); // Log the decoded token for debugging
    const user = await UserModel.findById(decoded.id); // Find the user by ID in the database

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // Attach the user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please log in again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token format." });
    }

    return res.status(400).json({ message: "Invalid token." });
  }
};
