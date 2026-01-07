import express from "express";
import { getTeamMembers } from "../controllers/teamController.js";

const router = express.Router();

router.get("/team", getTeamMembers);

export default router;
