import express from "express";
import dotenv from "dotenv";
import connectDB from "./App/Config/database.js";
import userrouter from "./App/Routes/userRoutes.js";
import contactrouter from "./App/Routes/ContactRouter.js";

const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

connectDB(); // Connect to MongoDB

const PORT = process.env.PORT || 1030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/user", userrouter); // Use user routes
app.use("/api/contact", contactrouter); // Use contact routes
