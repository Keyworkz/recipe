import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.jsx";
import ImageUploader from "./ImageUploader.jsx";
import StepInput from "./StepInput.jsx";
import { saveRecipe } from "../lib/recipeStore.js";

export default function NewRecipeForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [stepText, setStepText] = useState("");
  const [steps, setSteps] = useState([]);
  const [image, setImage] = useState(null);

  const canSave = useMemo(
    () => title.trim().length > 0 && steps.length > 0,
    [title, steps.length],
  );

  function addStep() {
    const nextStep = stepText.trim();
    if (!nextStep) return;
    setSteps((currentSteps) => [...currentSteps, nextStep]);
    setStepText("");
  }

  function removeStep(indexToRemove) {
    setSteps((currentSteps) =>
      currentSteps.filter((_, index) => index !== indexToRemove),
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSave) return;

    saveRecipe({
      id: crypto.randomUUID(),
      title: title.trim(),
      description: "A saved recipe with precise steps and a calm place to return.",
      steps,
      image,
      createdAt: new Date().toISOString(),
    });
    navigate("/");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-400">New recipe</p>
        <h1 className="mt-3 text-4xl font-bold tracking-normal text-white sm:text-5xl">
          Add a recipe
        </h1>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900 p-5 sm:p-6">
        <div className="space-y-8">
          <div>
            <label
              htmlFor="recipe-title"
              className="block text-sm font-medium text-gray-200"
            >
              Recipe title
            </label>
            <input
              id="recipe-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Creamy tomato pasta"
              className="mt-2 h-14 w-full rounded-md border border-gray-700 bg-gray-950 px-4 text-lg font-semibold text-gray-50 outline-none transition placeholder:font-normal placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              autoFocus
            />
          </div>

          <StepInput
            value={stepText}
            onChange={setStepText}
            onAdd={addStep}
            steps={steps}
            onRemove={removeStep}
          />

          <ImageUploader
            image={image}
            onChange={setImage}
            onRemove={() => setImage(null)}
          />
        </div>

        <div className="mt-8 flex justify-end border-t border-gray-800 pt-5">
          <Button type="submit" disabled={!canSave}>
            Save recipe
          </Button>
        </div>
      </div>
    </form>
  );
}
