import express from "express";
import { deleteMessage, getAllMessages, sendMessage } from "../controller/massageController.js";
import { isAuthentication } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", getAllMessages);
router.delete("/delete/:id", isAuthentication, deleteMessage);

export default router;