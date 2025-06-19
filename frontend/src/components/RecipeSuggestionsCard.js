import React from "react";

const RecipeSuggestionsCard = ({ recipes, onSelect, loading, error, onBack }) => (
  <div className={`food-card card-recipes ${recipes.length ? "slide-in" : ""}`}>
    <div className="food-card-header">
      <h4>Recipe Suggestions</h4>
      <button onClick={onBack} className="back-btn">← Back</button>
    </div>
    {loading && <div>Loading...</div>}
    {error && <div className="error">{error}</div>}
    <div className="recipes-list">
      {recipes.map(recipe => (
        <div className="recipe-item" key={recipe.id} onClick={() => onSelect(recipe)}>
          <img src={recipe.image} alt={recipe.title} />
          <span>{recipe.title}</span>
        </div>
      ))}
    </div>
  </div>
);

export default RecipeSuggestionsCard;