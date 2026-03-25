import express from "express";
import { generateEmbeddings } from "../controllers/embed_controller.mjs";

const router = express.Router();

router.post("/embed", generateEmbeddings);

export default router;
