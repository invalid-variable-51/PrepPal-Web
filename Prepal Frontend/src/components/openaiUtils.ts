const HUGGINGFACE_API_KEY = "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"; // Replace with actual key

export const generateFlashcardsFromHuggingFace = async (topic: string): Promise<string[]> => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `Create 5 educational flashcards about "${topic}". Each flashcard should be on a new line and contain a key fact.`,
          parameters: { max_new_tokens: 250 },
        }),
      }
    );

    const data = await response.json();
    console.log("API Response:", data);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(data)}`);
    }

    const text = data?.[0]?.generated_text || data?.[0]?.summary_text || "";
    if (!text) throw new Error("No meaningful response received.");

    const flashcards = text
      .split(/\n/)
      .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line: string) => line.length > 5)
      .slice(0, 5);

    return flashcards;
  } catch (error) {
    console.error("Hugging Face API Error:", error);
    return ["Error generating flashcards."];
  }
};

export const generateRoadmapFromHuggingFace = async (topic: string): Promise<string[]> => {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `List 3 concise, high-level roadmap topics (2-3 words only) a learner should study to master "${topic}". Answer only with bullet points.`,
          parameters: { max_new_tokens: 250 },
        }),
      }
    );

    const data = await response.json();
    console.log("Roadmap API Response:", data);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(data)}`);
    }

    const text = data?.[0]?.generated_text || data?.[0]?.summary_text || "";
    if (!text) throw new Error("No meaningful roadmap received.");

    const lines = text
      .split(/\n+/)
      .map((line: string) => line.replace(/^[-•\d]+\s*/, "").trim())
      .filter((line: string) =>
        line.length > 3 &&
        !line.toLowerCase().includes(topic.toLowerCase())
      )
      .map((line:string) => line.split(" ").slice(0, 3).join(" ")); // Limit to 3 words max

    return lines;
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    return ["Error generating roadmap. Please try again later."];
  }
};
