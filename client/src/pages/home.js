import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const navigate = useNavigate();
  const userID = useGetUserID();
  const [cookies] = useCookies(["access_token"]); // ✅ Get auth token

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://foodgram-xap1.onrender.com/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.error("Error fetching recipes:", err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        if (!userID) return;
        const response = await axios.get(
          `https://foodgram-xap1.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  // ✅ Function to Save a Recipe
  const saveRecipe = async (recipeID) => {
    try {
      await axios.put(
        "https://foodgram-xap1.onrender.com/recipes/save",
        { recipeID, userID },
        { headers: { authorization: cookies.access_token } }
      );

      setSavedRecipes([...savedRecipes, recipeID]); // ✅ Update saved recipes state
      alert("Recipe Saved!");
    } catch (err) {
      console.error("Error saving recipe:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center animate__animated animate__fadeInDown">🔥 Explore Delicious Recipes</h1>
      <Row className="g-4 justify-content-center">
        {recipes
          .filter(recipe => recipe.name !== "sdklnfl" && recipe.imageUrl)
          .map((recipe, index) => (
            <Col xs={12} sm={6} md={4} key={recipe._id} className="d-flex justify-content-center">
              <Card className="mb-4 animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s`, width: "22rem" }}>
                <Card.Img variant="top" src={recipe.imageUrl} className="card-img-top" alt={recipe.name} />
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <Card.Text>{recipe.description }</Card.Text>
                  <Button variant="primary" onClick={() => navigate(`/recipe/${recipe._id}`)}>View Recipe</Button>
                  {/* ✅ Save Recipe Button */}
                  <Button
                    variant="success"
                    className="mt-2"
                    onClick={() => saveRecipe(recipe._id)}
                    disabled={savedRecipes.includes(recipe._id)} // ✅ Disable if already saved
                  >
                    {savedRecipes.includes(recipe._id) ? "Saved" : "Save Recipe"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};


