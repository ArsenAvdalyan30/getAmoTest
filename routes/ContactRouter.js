import express from "express";
const router = express.Router();
import ContactController from "../controllers/ContactController.js";

router.get("/getContact/:id", (req, res) =>
  ContactController.getContact(req, res)
);

router.get("/getContacts", (req, res) =>
  ContactController.getContacts(req, res)
);

export default router;
