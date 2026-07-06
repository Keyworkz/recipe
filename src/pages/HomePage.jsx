import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection.jsx";
import RecipeGrid from "../components/RecipeGrid.jsx";
import { sampleRecipes } from "../data/sampleRecipes.js";
import { getSavedRecipes } from "../lib/recipeStore.js";

export default function HomePage() {
  const [savedRecipes, setSavedRecipes] = useState([]);

  useEffect(() => {
    setSavedRecipes(getSavedRecipes());
  }, []);

  return (
    <>
      <HeroSection />
      <RecipeGrid recipes={[...savedRecipes, ...sampleRecipes]} />
    </>
  );
}
