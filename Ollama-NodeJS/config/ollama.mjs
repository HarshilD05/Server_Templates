import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import util from "util";

const execPromise = util.promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OLLAMA_BASE_URL = "http://127.0.0.1:11434/";

export async function initOllama() {
    try {
        // 1. Check if Ollama is installed
        try {
            const { stdout } = await execPromise("ollama -v");
            console.log(`✅ Ollama is installed: ${stdout.trim()}`);
        } catch (error) {
            throw new Error("Ollama is not installed. Please install Ollama first from https://ollama.com/");
        }

        // 2. Check if Ollama is running
        let isRunning = false;
        try {
            const response = await fetch(OLLAMA_BASE_URL);
            if (response.ok) {
                isRunning = true;
                console.log("✅ Ollama instance is already running.");
            }
        } catch (error) {
            console.log("⚠️ Ollama is not running. Starting ollama serve...");
        }

        if (!isRunning) {
            const logPath = path.join(__dirname, "..", "ollama.log");
            const logStream = fs.createWriteStream(logPath, { flags: "a" });

            const ollamaProcess = spawn("ollama", ["serve"], {
                detached: true,
                stdio: ["ignore", logStream, logStream]
            });
            ollamaProcess.unref(); // Allow the parent process to exit independently

            console.log(`✅ Started Ollama process. Logs are tied to ${logPath}`);
            
            // Wait a few seconds for server to start
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // 3. Check and install required models
        const reqModelsPath = path.join(__dirname, "req_models.txt");
        if (fs.existsSync(reqModelsPath)) {
            const requiredModels = fs.readFileSync(reqModelsPath, "utf8")
                .split("\n")
                .map(m => m.trim())
                .filter(m => m.length > 0);

            let installedModels = [];
            try {
                const { stdout } = await execPromise("ollama list");
                installedModels = stdout.split("\n").slice(1).map(line => line.split("\t")[0].trim().split(":")[0]);
            } catch (err) {
                console.error("Failed to list models:", err.message);
            }

            for (const model of requiredModels) {
                if (!installedModels.includes(model)) {
                    console.log(`⏳ Model '${model}' not found. Pulling model... This may take a while.`);
                    try {
                        const { stdout } = await execPromise(`ollama pull ${model}`);
                        console.log(`✅ Successfully pulled model '${model}'`);
                    } catch (error) {
                        console.error(`❌ Failed to pull model '${model}':`, error.message);
                    }
                } else {
                    console.log(`✅ Model '${model}' is already installed.`);
                }
            }
        }

    } catch (error) {
        console.error(`❌ Initialization Error: ${error.message}`);
        process.exit(1);
    }
}
