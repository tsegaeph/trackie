const express = require('express');
const router = express.Router();

// List of quotes and tips
const quotes = [
    {
      quote: "The only way to discover the limits of the possible is to go beyond them into the impossible.",
      author: "Arthur C. Clarke",
      tipTitle: "TODAY'S TIP",
      tipDesc: "Don't be afraid to experiment with new ideas in your studies."
    },
    {
      quote: "Scientists study the world as it is; engineers create the world that never has been.",
      author: "Theodore von Kármán",
      tipTitle: "TODAY'S TIP",
      tipDesc: "Apply what you learn to build or improve something, even if it's small."
    },
    {
      quote: "Technology is best when it brings people together.",
      author: "Matt Mullenweg",
      tipTitle: "TODAY'S TIP",
      tipDesc: "Collaborate with classmates on projects. Engineering is a team sport."
    },
    {
      quote: "Success is a science; if you have the conditions, you get the result.",
      author: "Oscar Wilde",
      tipTitle: "TODAY'S TIP",
      tipDesc: "Stay consistent with your habits — small progress every day adds up."
    },
    {
      quote: "Engineering is not only study of 45 subjects but it is moral studies of intellectual life.",
      author: "Prakhar Srivastav",
      tipTitle: "TODAY'S TIP",
      tipDesc: "Take care of your mindset as much as your circuit diagrams."
    },
    {
      quote: "The engineer has been, and is, a maker of history.",
      author: "James Kip Finch",
      tipTitle: "TODAY'S TIP",
      tipDesc: "You're not just studying—you're preparing to shape the future."
    },
    {
      quote: "It’s not that we use technology, we live technology.",
      author: "Godfrey Reggio",
      tipTitle: "TODAY'S TIP",
      tipDesc: "Make time to explore how tech impacts the real world—not just exams."
    }
  ];
  

// Helper to get day of year
function getDayOfYear(d = new Date()) {
  return Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
}

router.get('/today', (req, res) => {
  const idx = getDayOfYear() % quotes.length;
  res.json(quotes[idx]);
});

module.exports = router;