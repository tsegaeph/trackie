import React from "react";
import "./QuickLinksCard.css";

const QuickLinksCard = () => (
  <div className="quick-links-card">
    <div className="quick-links-title">Quick links</div>
    <ul className="quick-links-list">
      <li>
        <a href="https://www.engineering.com" target="_blank" rel="noopener noreferrer">
          Engineering.com
        </a>
      </li>
      <li>
        <a href="https://ieeexplore.ieee.org" target="_blank" rel="noopener noreferrer">
          IEEE Resources
        </a>
      </li>
      <li>
        <a href="https://www.allaboutcircuits.com" target="_blank" rel="noopener noreferrer">
          All About Circuits
        </a>
      </li>
    </ul>
  </div>
);

export default QuickLinksCard;
