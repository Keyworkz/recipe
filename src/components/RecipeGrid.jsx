import RecipeCard from "./RecipeCard.jsx";

export default function RecipeGrid({ recipes }) {
  return (
    <section aria-labelledby="recipe-grid-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 id="recipe-grid-title" className="text-sm font-semibold text-gray-100">
            Recipes
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Four samples plus anything you save locally.
          </p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}
