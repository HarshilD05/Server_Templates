import "dotenv/config"
import express from "express";
import { initOllama } from "./config/ollama.mjs";
import embedRoutes from "./routes/embed_routes.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Ollama Check
await initOllama();

// Routes
app.use("/api", embedRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
