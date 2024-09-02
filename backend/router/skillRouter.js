import express from "express";
import { isAuthentication } from "../middlewares/auth.js";

import {
  addNewSkill,
  deleteSkill,
  getAllSkill,
  updateSkill,
} from "../controller/skillController.js";

const router = express.Router();

router.post("/add", isAuthentication, addNewSkill);
router.delete("/delete/:id", isAuthentication, deleteSkill);
router.put("/update/:id", isAuthentication, updateSkill);
router.get("/getall", getAllSkill);

export default router;
