import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Card } from "react-bootstrap";

export const RecipeDetails = () => {
  const { id } = useParams(); // ✅ Get Recipe ID from URL
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`https://foodgram-xap1.onrender.com/recipes/${id}`);
        console.log("Fetched Recipe Details:", response.data);
        setRecipe(response.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <p className="text-center">Loading recipe...</p>;

  return (
    <Container className="mt-4">
      <Card className="p-4">
        <Card.Img variant="top" src={recipe.imageUrl} className="mb-3" />
        <Card.Body>
          <h2>{recipe.name}</h2>
          <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
          <p><strong>Instructions:</strong> {recipe.instructions}</p>
          <p><strong>Cooking Time:</strong> {recipe.cookingTime} minutes</p>
        </Card.Body>
      </Card>
    </Container>
  );
};
