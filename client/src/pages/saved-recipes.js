import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://foodgram-xap1.onrender.com/recipes/savedRecipes/${userID}` // ✅ Fixed API URL
        );
        setSavedRecipes(response.data.savedRecipes || []); // ✅ Handle undefined case
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
      }
    };

    if (userID) {
      fetchSavedRecipes(); // ✅ Fetch only if userID exists
    }
  }, [userID]); // ✅ Added userID as dependency

  return (
    <div>
      <h1>Saved Recipes</h1>
      {savedRecipes.length === 0 ? (
        <p>No saved recipes found.</p>
      ) : (
        <ul>
          {savedRecipes.map((recipe) => (
            <li key={recipe._id}>
              <div>
                <h2>{recipe.name}</h2>
              </div>
              <p>{recipe.description}</p>
              <img src={recipe.imageUrl} alt={recipe.name} style={{ width: "200px", height: "200px" }} />
              <p>Cooking Time: {recipe.cookingTime} minutes</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
