import React, { useState } from "react";

const FoodIngredientsInputCard = ({ onSearch, loading }) => {
  const [input, setInput] = useState("");

  return (
    <div className="food-card card-input">
      <h5>Let's cook at home together 🍲</h5>
      <h4>Enter Ingredients you have</h4>
      <input
        type="text"
        placeholder="e.g. chicken, onion, garlic"
        value={input}
        onChange={e => setInput(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={() => onSearch(input)}
        disabled={loading || !input.trim()}
      >
        {loading ? "Searching..." : "Find Recipes"}
      </button>
    </div>
  );
};

export default FoodIngredientsInputCard;