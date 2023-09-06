import express from "express";
import ContactRouter from "./ContactRouter.js";
const router = express.Router();
router.use("/users", ContactRouter);

export default router;
