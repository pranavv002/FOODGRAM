import express from "express";
import mongoose from "mongoose";
import RecipeModel from "../models/Recipe.js";  
import UserModel from "../models/User.js";  
import { verifyToken } from "./authRoutes.js";  

const router = express.Router();

// ✅ Get all recipes
router.get("/", async (req, res) => {
  try {
    const result = await RecipeModel.find({});
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Create a new recipe (Only for logged-in users)
router.post("/", verifyToken, async (req, res) => {
  try {
    const recipe = new RecipeModel({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      image: req.body.image,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      imageUrl: req.body.imageUrl,
      cookingTime: req.body.cookingTime,
      userOwner: req.body.userOwner,
    });

    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        image: result.image,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    console.error("Error creating recipe:", err);
    res.status(500).json({ error: "Failed to create recipe" });
  }
});

// ✅ Get a single recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipeModel.findById(req.params.recipeId);
    if (!result) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error("Error fetching recipe:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Save a Recipe (Prevent duplicates)
router.put("/save", async (req, res) => {
  try {
    const { recipeID, userID } = req.body;

    const recipe = await RecipeModel.findById(recipeID);
    const user = await UserModel.findById(userID);

    if (!recipe || !user) {
      return res.status(404).json({ message: "Recipe or user not found" });
    }

    if (!user.savedRecipes.includes(recipeID)) {
      user.savedRecipes.push(recipeID); // ✅ Prevent duplicate saves
      await user.save();
    }

    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error("Error saving recipe:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get IDs of saved recipes
router.get("/savedRecipes/ids/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ savedRecipes: user.savedRecipes || [] });
  } catch (err) {
    console.error("Error fetching saved recipe IDs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get full saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes || [] },  // ✅ Prevents crash if `savedRecipes` is undefined
    });

    res.status(200).json({ savedRecipes });
  } catch (err) {
    console.error("Error fetching saved recipes:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
