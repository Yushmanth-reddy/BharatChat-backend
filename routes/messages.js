import express from "express";
import { addMessage, getAllMessage } from "../controllers/message.js";
import { veriftJWT } from "../middleware/token.js";

const router = express.Router();

router.post("/addmessage", veriftJWT, addMessage);
router.post("/getmessage", veriftJWT, getAllMessage);

export default router;
