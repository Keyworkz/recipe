import { Plus } from "lucide-react";
import Button from "./Button.jsx";

export default function HeroSection() {
  return (
    <section className="pb-12 pt-4 sm:pb-14 lg:pb-16">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold text-blue-400">Recipe system</p>
        <h1 className="text-5xl font-bold tracking-normal text-white sm:text-6xl lg:text-7xl">
          Save your favorite recipes
        </h1>
        <p className="mt-5 max-w-2xl text-balance text-lg leading-8 text-gray-400">
          Capture simple recipes with steps, notes, and an optional dish image.
        </p>
        <div className="mt-8">
          <Button to="/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New recipe
          </Button>
        </div>
      </div>
    </section>
  );
}
