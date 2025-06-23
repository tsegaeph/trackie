import React, { useEffect, useState } from "react";
import "./TechNewsCard.css";

// You need to get your own API key from https://newsapi.org/
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

// Broader, highly relevant keywords for tech, AI, electrical engineering, hackathons, cybersecurity, GITEX, etc.
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
  "UAE technology",
  "blockchain",
  "quantum computing",
  "startup UAE",
  "digital transformation",
];

const NEWS_API_URL = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
  KEYWORDS.join(" OR ")
)}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${NEWS_API_KEY}`;

const TechNewsCard = () => {
  const [articles, setArticles] = useState([]);
  const [slideIdx, setSlideIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(NEWS_API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch news.");
        return res.json();
      })
      .then((data) => {
        if (data.articles) {
          // Filter out articles with no image or description for better UI
          const filtered = data.articles.filter(
            (a) => a.urlToImage && a.description
          );
          setArticles(filtered);
        } else {
          setArticles([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load news articles.");
        setLoading(false);
      });
  }, []);

  // Show 4 articles at a time
  const articlesToShow = 4;
  const maxSlide = Math.max(0, articles.length - articlesToShow);

  // Prevents sliding to empty slots if there are not enough articles
  const safeSlideIdx = Math.min(slideIdx, maxSlide);

  const handlePrev = () => setSlideIdx((idx) => Math.max(0, idx - articlesToShow));
  const handleNext = () => setSlideIdx((idx) => Math.min(maxSlide, idx + articlesToShow));

  return (
    <div className="dashboard-card tech-news-card">
      <h4 className="tech-news-title">Tech News & Events</h4>
      {loading && <div className="tech-news-loading">Loading...</div>}
      {error && <div className="tech-news-error">{error}</div>}
      {!loading && !error && (
        <div className="tech-news-slider">
          {/* Show arrows only if more than 4 articles */}
          {articles.length > articlesToShow && (
            <button
              className="tech-news-arrow tech-news-arrow-left"
              onClick={handlePrev}
              disabled={safeSlideIdx === 0}
              aria-label="Previous news"
              tabIndex={0}
              type="button"
            >
              &#8592;
            </button>
          )}
          <div className="tech-news-cards-viewport">
            <div
              className="tech-news-cards-row"
              style={{
                transform: `translateX(-${safeSlideIdx * (100 / articlesToShow)}%)`,
                width: `${(articles.length * 100) / articlesToShow}%`,
              }}
            >
              {articles.map((article, idx) => (
                <div key={idx} className="tech-news-article-card">
                  <a
                    href={article.url}
                    className="tech-news-img-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={
                        article.urlToImage ||
                        "https://via.placeholder.com/180x120?text=No+Image"
                      }
                      alt={article.title}
                      className="tech-news-img"
                    />
                  </a>
                  <div className="tech-news-article-info">
                    <a
                      href={article.url}
                      className="tech-news-article-title"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title.length > 80
                        ? article.title.slice(0, 77) + "..."
                        : article.title}
                    </a>
                    <div className="tech-news-article-date">
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-GB",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </div>
                    <div className="tech-news-article-desc">
                      {article.description
                        ? article.description.length > 110
                          ? article.description.slice(0, 107) + "..."
                          : article.description
                        : "No description available."}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Show arrows only if more than 4 articles */}
          {articles.length > articlesToShow && (
            <button
              className="tech-news-arrow tech-news-arrow-right"
              onClick={handleNext}
              disabled={safeSlideIdx >= maxSlide}
              aria-label="Next news"
              tabIndex={0}
              type="button"
            >
              &#8594;
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TechNewsCard;