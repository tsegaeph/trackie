import React, { useEffect, useState } from "react";
import "./QuoteCard.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const QuoteCard = () => {
  const [quoteData, setQuoteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/quotes/today`)
      .then(res => res.json())
      .then(data => {
        setQuoteData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching quote:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="quote-card">Loading...</div>;
  if (!quoteData) return <div className="quote-card">No quote available.</div>;

  return (
    <div className="quote-card">
      <div className="quote-card-quote">
        <span className="quote-mark">“</span>
        <span>
          {quoteData.quote}
        </span>
      </div>
      <div className="quote-card-author">
        – {quoteData.author}
      </div>
      <div className="quote-card-tip">
        <div className="tip-title">{quoteData.tipTitle}</div>
        <div className="tip-desc">
          {quoteData.tipDesc}
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;