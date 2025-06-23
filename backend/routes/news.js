// trackie-backend/routes/news.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

const NEWS_API_KEY = process.env.NEWS_API_KEY;

const KEYWORDS = [
  "artificial intelligence",
  "AI",
  "machine learning",
  "electrical engineering",
  "tech innovation",
  "hackathon",
  "cybersecurity",
  "GITEX",
  "robotics",
  "CTF competition",
  "technology",
  "quantum computing",
  "startup UAE",
  "digital transformation",
];

router.get("/tech-news", async (req, res) => {
  if (!NEWS_API_KEY) {
    return res.status(500).json({ error: "News API key is not set in environment." });
  }

  const url = `https://newsapi.org/v2/everything`;
  const params = {
    q: KEYWORDS.join(" OR "),
    language: "en",
    sortBy: "publishedAt",
    pageSize: 12,
    apiKey: NEWS_API_KEY,
  };

  try {
    const response = await axios.get(url, { params });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching tech news:", err.message);
    res.status(500).json({ error: "Failed to fetch tech news" });
  }
});

module.exports = router;
