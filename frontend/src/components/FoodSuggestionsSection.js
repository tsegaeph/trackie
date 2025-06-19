import React, { useState } from "react";
import FoodIngredientsInputCard from "./FoodIngredientsInputCard";
import RecipeSuggestionsCard from "./RecipeSuggestionsCard";
import CookingInstructionsCard from "./CookingInstructionsCard";
import "./FoodSuggestionsSection.css";

const API_KEY = "52f2bb2e40f24323b2160e45ed79e0f5";

const FoodSuggestionsSection = () => {
  const [recipes, setRecipes] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show/hide control
  const [showRecipes, setShowRecipes] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleSearch = async (ingredients) => {
    setLoading(true); setError(""); setShowInstructions(false); setInstructions([]);
    setShowRecipes(false); setRecipes([]);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
          ingredients
        )}&number=6&apiKey=${API_KEY}`
      );
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
      setShowRecipes(true);
    } catch {
      setError("Failed to fetch recipes.");
    }
    setLoading(false);
  };

  const handleSelectRecipe = async (recipe) => {
    setSelectedRecipe(recipe);
    setInstructions([]);
    setError("");
    setShowInstructions(false);
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions?apiKey=${API_KEY}`
      );
      const data = await res.json();
      setInstructions(data?.[0]?.steps || []);
      setShowInstructions(true);
    } catch {
      setError("Failed to fetch instructions.");
    }
    setLoading(false);
  };

  return (
    <div className="food-suggestions-row">
      <FoodIngredientsInputCard onSearch={handleSearch} loading={loading && !showRecipes} />
      {showRecipes && (
        <RecipeSuggestionsCard
          recipes={recipes}
          onSelect={handleSelectRecipe}
          loading={loading && !showInstructions}
          error={error}
          onBack={() => setShowRecipes(false)}
        />
      )}
      {showInstructions && (
        <CookingInstructionsCard
          recipe={selectedRecipe}
          instructions={instructions}
          loading={loading}
          error={error}
          onBack={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
};

export default FoodSuggestionsSection;