import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://mern-recipe-app1-server.onrender.com/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRecipes();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4 text-center animate__animated animate__fadeInDown">🔥 Explore Delicious Recipes</h1>
      <Row className="g-4 justify-content-center"> {/* Ensures proper alignment */}
        {recipes
          .filter(recipe => recipe.name !== "sdklnfl" && recipe.imageUrl) // 🔥 Removes "sdklnfl"
          .map((recipe, index) => (
            <Col xs={12} sm={6} md={4} key={recipe._id} className="d-flex justify-content-center">
              <Card className="mb-4 animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s`, width: "22rem" }}>
                <Card.Img variant="top" src={recipe.imageUrl} className="card-img-top" alt={recipe.name} />
                <Card.Body>
                  <Card.Title>{recipe.name}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  <Button variant="primary">View Recipe</Button>
                </Card.Body>
              </Card>
            </Col>
        ))}
      </Row>
    </Container>
  );
};

