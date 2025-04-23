import mongoose from "mongoose";
import { type } from "os";

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ContactModel = mongoose.model("Contact", ContactSchema);
export default ContactModel;
