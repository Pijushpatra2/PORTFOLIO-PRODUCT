import express from "express";
import { isAuthentication } from "../middlewares/auth.js";

import {
  addNewProject,
  deleteProject,
  getAllProject,
  updateProject,
  getSingleProject,
} from "../controller/projectController.js";

const router = express.Router();

router.post("/add", isAuthentication, addNewProject);
router.delete("/delete/:id", isAuthentication, deleteProject);
router.put("/update/:id", isAuthentication, updateProject);
router.get("/getall", getAllProject);
router.get("/get/:id", getSingleProject);
export default router;
