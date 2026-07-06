const STORAGE_KEY = "linear_recipe_app_recipes";

export function getSavedRecipes() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function saveRecipe(recipe) {
  const recipes = getSavedRecipes();
  const nextRecipes = [recipe, ...recipes];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecipes));
  return nextRecipes;
}
