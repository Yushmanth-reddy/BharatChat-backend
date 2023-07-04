import express from "express";
import { veriftJWT } from "../middleware/token.js";
import { getallusers } from "../controllers/user.js";

const router = express.Router();

router.get("/getallusers/:id", veriftJWT, getallusers);

export default router;
