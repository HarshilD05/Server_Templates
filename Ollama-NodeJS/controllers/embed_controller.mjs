export const generateEmbeddings = async (req, res) => {
    try {
        const { texts, model = "nomic-embed-text" } = req.body;

        if (!texts || !Array.isArray(texts)) {
            return res.status(400).json({ error: "Please provide an array of strings in the \"texts\" field." });
        }

        if (texts.length > 100) {
            return res.status(400).json({ error: "Exceeded maximum limit of 100 texts per request." });
        }

        if (texts.length === 0) {
            return res.status(400).json({ error: "The texts array cannot be empty." });
        }

        // Calling Ollama's native /api/embed endpoint
        const response = await fetch("http://127.0.0.1:11434/api/embed", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                input: texts
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Ollama API error: ${errorData}`);
        }

        const data = await response.json();

        return res.status(200).json({
            success: true,
            model: data.model,
            embeddings: data.embeddings
        });

    } catch (error) {
        console.error("Embedding Generation Error:", error);
        return res.status(500).json({ error: "Internal Server Error while generating embeddings." });
    }
};
