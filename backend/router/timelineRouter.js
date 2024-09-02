import express from "express";
import { isAuthentication } from "../middlewares/auth.js";

import {
  deleteTimeline,
  getAllTimeLine,
  postTimeLine,
} from "../controller/timelineController.js";

const router = express.Router();

router.post("/add", isAuthentication, postTimeLine);
router.delete("/delete/:id", isAuthentication, deleteTimeline);
router.get("/getall", getAllTimeLine);

export default router;
