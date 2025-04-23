import express from "express";
import {
  deleteContactById,
  getAllContacts,
  getContactById,
  getContactsByUserId,
  newContact,
  updateContactById,
} from "../Controller/contactController.js";
import { authenticateJWT } from "../../Middleware/Authentication.js";

const router = express.Router();

router.post("/new", authenticateJWT, newContact);
router.get("/getall", getAllContacts);
router.get("/get/:id", getContactById);
router.put("/update/:id", authenticateJWT, updateContactById);
router.delete("/delete/:id", authenticateJWT, deleteContactById);
router.get("/userid/:id", getContactsByUserId);
export default router;
