// AI Configuration File
// This file contains settings for integrating real AI services

const AI_CONFIG = {
  // OpenAI GPT Integration (requires API key)
  openai: {
    apiKey: "your-openai-api-key-here", // Replace with your actual API key
    model: "gpt-3.5-turbo",
    maxTokens: 150,
  },

  // Hugging Face Integration (free tier available)
  huggingface: {
    apiKey: "your-huggingface-api-key-here", // Replace with your actual API key
    model: "microsoft/CodeBERT-base",
  },

  // Google AI (Gemini) Integration
  google: {
    apiKey: "your-google-ai-api-key-here", // Replace with your actual API key
  },
};

// Real AI API Integration Functions
async function callOpenAI(prompt) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_CONFIG.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.openai.model,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful programming tutor. Provide clear, concise answers about programming concepts and code examples.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: AI_CONFIG.openai.maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

async function callHuggingFace(text) {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${AI_CONFIG.huggingface.model}`,
      {
        headers: {
          Authorization: `Bearer ${AI_CONFIG.huggingface.apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: text,
          parameters: {
            max_length: 150,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    return data[0].generated_text;
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw error;
  }
}

// Enhanced AI Response Function using real APIs
async function getEnhancedAIResponse(message) {
  // Check if API keys are configured
  if (
    AI_CONFIG.openai.apiKey &&
    AI_CONFIG.openai.apiKey !== "your-openai-api-key-here"
  ) {
    try {
      return await callOpenAI(message);
    } catch (error) {
      console.log("OpenAI failed, falling back to rule-based responses");
    }
  }

  if (
    AI_CONFIG.huggingface.apiKey &&
    AI_CONFIG.huggingface.apiKey !== "your-huggingface-api-key-here"
  ) {
    try {
      return await callHuggingFace(message);
    } catch (error) {
      console.log("Hugging Face failed, falling back to rule-based responses");
    }
  }

  // Fallback to the rule-based system we created earlier
  return await getAIResponse(message);
}

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AI_CONFIG, getEnhancedAIResponse };
}
