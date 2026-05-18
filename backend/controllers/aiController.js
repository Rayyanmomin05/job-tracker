const Groq = require('groq-sdk');
require('dotenv').config();

const client = new Groq({ apiKey: process.env.GROK_API_KEY });

// POST /ai/suggest
const getSuggestions = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a career coach. Given a job description, give exactly 3 short, 
          practical tips on what skills or experiences the candidate should highlight in 
          their resume and interview. Format as a JSON array of 3 strings. 
          Return only the JSON array, nothing else.`,
        },
        {
          role: 'user',
          content: description,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const raw = response.choices[0].message.content.trim();
    const tips = JSON.parse(raw);

    res.json({ tips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSuggestions };