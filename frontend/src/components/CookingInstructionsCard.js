import React from "react";

const CookingInstructionsCard = ({ recipe, instructions, loading, error, onBack }) => (
  <div className={`food-card card-instructions ${instructions.length ? "slide-in" : ""}`}>
    <div className="food-card-header">
      <h4>{recipe?.title || "Instructions"}</h4>
      <button onClick={onBack} className="back-btn">← Back</button>
    </div>
    <img src={recipe.image} alt={recipe.title} className="instructions-thumb" />
    {loading && <div>Loading...</div>}
    {error && <div className="error">{error}</div>}
    <ol>
      {instructions.map(step => (
        <li key={step.number}>{step.step}</li>
      ))}
    </ol>
  </div>
);

export default CookingInstructionsCard;