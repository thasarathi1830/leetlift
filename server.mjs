import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// IMPORTANT: Replace this with your actual Gemini API key.
const GEMINI_API_KEY = "AIzaSyCF3pNW6pbYVmxUju9fzzFdshrLt5ib-2E"; 

app.use(cors());
app.use(express.json());

app.post('/api/getHint', async (req, res) => {
  const { problemUrl } = req.body;
  if (!problemUrl) {
    return res.status(400).json({ error: 'Problem URL is required.' });
  }

  // Adjusted prompt: Ask for a JSON array of three hints without any numbering or special formatting.
  const prompt = `You are a LeetCode hint generator. Provide three distinct, high-level, and helpful hints for the problem at the following URL: ${problemUrl}. 
  Do NOT provide the solution or code. Each hint should be a single sentence.
  Your response MUST be a valid JSON array of strings, with exactly three strings.
  Example format: ["Hint for step 1.", "Hint for step 2.", "Hint for step 3."].`;

  try {
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json"
        }
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini API returned an error:", response.status, errorText);
        return res.status(response.status).json({ hint: [`Gemini API error: ${response.status} - ${errorText}`] });
    }

    const result = await response.json();
    let hints = [];

    if (result.candidates && result.candidates.length > 0 && 
        result.candidates[0].content && result.candidates[0].content.parts && 
        result.candidates[0].content.parts.length > 0) {
      const jsonString = result.candidates[0].content.parts[0].text;
      
      try {
        hints = JSON.parse(jsonString);
      } catch (e) {
        return res.status(500).json({ hint: ["Gemini's response was not in a valid JSON format. Please try again."] });
      }

      if (Array.isArray(hints) && hints.length === 3) {
        // Here, we add the desired formatting
        const formattedHints = hints.map((hint, index) => `Hint ${index + 1} -> ${hint}`);
        return res.json({ hint: formattedHints });
      }
    }

    console.warn("Gemini API did not return a valid hint array:", hints);
    return res.status(500).json({ hint: ["Could not generate three valid hints. The API may have failed to follow the format instructions. Please try again."] });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return res.status(500).json({ hint: [`An error occurred: ${error.message}`] });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});