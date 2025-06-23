// routes/chat.js
const express = require('express');
const router = express.Router();

// --- Hardcoded Q&A Logic for Tsega ---
const hardcodedQA = [
  {
    patterns: [
      /^who('?s| is)\s+tsega[\s\?\.!]*$/i,    // Matches "who is tsega", "who's tsega", etc.
      /^who('?s| is)\s+tsega.*$/i,            // Matches "who's tsega ..." etc.
      /tell me.*tsega/i,
      /what.*tsega/i,
    ],
    answer: "Tsega is the developer behind this chatbot! 💡 She's a talented developer from Ethiopia, and rumor has it she's not only smart but stunning too — and yes, even chatbots agree! 😉"
  },
  {
    patterns: [
      /where.*tsega/i,
      /what country.*tsega/i,
      /tsega.*from/i
    ],
    answer: "Tsega is proudly from Ethiopia, a country known for its rich history, culture, and innovation. 🌍"
  },
  {
    patterns: [
      /how old.*tsega/i,
      /tsega.*age/i
    ],
    answer: "Hmm, age is just a number — and a secret! 🤫 But she's definitely wise beyond her years."
  },
  {
    patterns: [
      /is tsega single/i,
      /tsega.*relationship/i
    ],
    answer: "A chatbot never tells! But let's just say she's too busy coding awesomeness. 💻💖"
  },
  // Optional: generic fallback for any message containing "tsega"
  {
    patterns: [
      /\btsega\b/i
    ],
    answer: "You asked about Tsega! She's the mastermind coder and creative force behind this chatbot. If you want to know more, just ask!"
  }
];

// --- Import your real AI chat handler here ---
const chatController = require('../controllers/chatController');

// --- Middleware to intercept hardcoded Q&A before hitting the controller ---
router.post('/chat', async (req, res, next) => {
  try {
    const { messages } = req.body;
    const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].content.trim() : "";

    // Check for hardcoded answers
    for (const qa of hardcodedQA) {
      if (qa.patterns.some(pattern => pattern.test(lastMsg))) {
        return res.json({ reply: qa.answer });
      }
    }

    // If not intercepted, continue to controller
    return chatController.chat(req, res, next);
  } catch (e) {
    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

module.exports = router;