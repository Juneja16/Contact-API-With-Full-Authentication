import ContactModel from "../Model/ContactModel.js";
import mongoose from "mongoose";

// new contact
export const newContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name.trim() || !email.trim() || !phone || !message.trim()) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new contact
    const newContact = new ContactModel({
      name,
      email,
      phone,
      message,
      user: req.user._id, // Attach the authenticated user's ID
    });

    // Save the contact to the database
    let contactSaveResp = await newContact.save();

    return res
      .status(201)
      .json({ message: "Contact created successfully", contactSaveResp });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//get all contacts
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactModel.find({}).lean();
    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//get contact by id
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format (optional, but recommended)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid contact ID" });
    }
    const contact = await ContactModel.findById(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    return res.status(200).json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//update contact by id
export const updateContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    // Validate the ID format (optional, but recommended)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid contact ID" });
    }

    // Find the contact by ID and update it
    const updatedContactResp = await ContactModel.findByIdAndUpdate(
      id,
      { name, email, phone, message },
      { new: true }
    );

    if (!updatedContactResp) {
      return res.status(404).json({ error: "Contact not found" });
    }

    return res
      .status(200)
      .json({ message: "Contact Updated", updatedContactResp, status: true });
  } catch (error) {
    console.error("Error updating contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//delete contact by id
export const deleteContactById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format (optional, but recommended)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid contact ID" });
    }

    // Find the contact by ID and delete it
    const deletedContactResp = await ContactModel.findByIdAndDelete(id);

    if (!deletedContactResp) {
      return res.status(404).json({ error: "Contact not found" });
    }

    return res
      .status(200)
      .json({ message: "Contact deleted successfully", status: true });
  } catch (error) {
    console.error("Error deleting contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//get  all contacts by user saved in the contacts database linked to the user id
export const getContactsByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    // Find contacts where 'user' field matches the provided user ID
    const contacts = await ContactModel.find({ user: id }).lean();

    if (!contacts.length) {
      return res.status(404).json({ error: "No contacts found for this user" });
    }

    return res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
