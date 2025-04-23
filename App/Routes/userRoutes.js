import express from "express";
import { loginUser, registerUser } from "../Controller/userController.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello World!");
});

// @api description: User Registration
// @api method: POST
// @api path/endpoint : /api/user/register
// @api access: Public
router.post("/register", registerUser);

// @api description: User Login
// @api method: POST
// @api path/endpoint : /api/user/login
// @api access: Public
router.post("/login", loginUser);

export default router;
