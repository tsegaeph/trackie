const axios = require('axios');

const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY; // store securely

exports.chat = async (req, res) => {
  const { messages } = req.body;
  // DEBUG: Log the payload
  console.log("Payload sent to Together:", JSON.stringify({
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    messages,
    temperature: 0.7,
    max_tokens: 500
  }, null, 2));

  try {
    const response = await axios.post(
      TOGETHER_API_URL,
      {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages,
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Together API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from Together.ai' });
  }
};