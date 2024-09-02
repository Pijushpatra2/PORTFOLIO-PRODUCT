import express from "express"
import {addNewApplication, deleteApplication, getAllApplication} from "../controller/softwareApplicationController.js";
import { isAuthentication } from "../middlewares/auth.js";

const router = express.Router();

router.post("/add", isAuthentication, addNewApplication);
router.delete("/delete/:id", isAuthentication, deleteApplication);
router.get("/getall", getAllApplication);

export default router;