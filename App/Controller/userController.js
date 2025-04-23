import { UserModel } from "../Model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("Received data:", { name, email, password });

  if (name == "" || email == "" || password == "") {
    return res.status(400).send({ message: "All fields are required!" });
  }
  // Check if the user already exists in the database
  // Use lean() to get a plain JavaScript object instead of a Mongoose document
  // Lean will remove extra methods(getters,setters,some overheads ...) and will
  // return a plain object which is faster to query and manipulate
  if (await UserModel.findOne({ email }).lean()) {
    return res
      .status(400)
      .send({ message: "User already exists!", status: false });
  }
  // Hash the password using bcryptjs
  const hashpassword = await bcrypt.hash(password, 10);

  if (!hashpassword) {
    return res.status(500).send({ message: "Error encrypting password" });
  }
  let userResponse = await UserModel.create({
    name: name,
    email: email,
    password: hashpassword,
  });
  res.send({
    message: "User registered successfully!",
    status: true,
    userResponse,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("Received data:", { email, password });

  if (email == "" || password == "") {
    return res.status(400).send({ message: "All fields are required!" });
  }
  const user = await UserModel.findOne({ email }).lean();
  if (!user) {
    return res.status(400).send({ message: "User not found!", status: false });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  console.log(password, user.password, isPasswordValid);
  if (!isPasswordValid) {
    return res
      .status(400)
      .send({ message: "Invalid password!", status: false });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.send({ message: "Login successful!", token, status: true, user });
};
