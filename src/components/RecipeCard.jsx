import { Image } from "lucide-react";

export default function RecipeCard({ recipe }) {
  return (
    <article className="group flex min-h-[360px] flex-col overflow-hidden rounded-lg border border-gray-800 bg-gray-900 transition duration-200 hover:border-blue-500 hover:shadow-blue-ring">
      <div className="flex aspect-[16/10] items-center justify-center border-b border-gray-800 bg-gray-950">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-gray-800 bg-gray-900 text-gray-500 transition group-hover:border-blue-500 group-hover:text-blue-400">
            <Image className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div>
          <h2 className="text-lg font-semibold tracking-normal text-gray-50">
            {recipe.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
            {recipe.description}
          </p>
        </div>
        <ol className="mt-5 space-y-3 border-t border-gray-800 pt-4 text-sm text-gray-300">
          {recipe.steps.slice(0, 2).map((step, index) => (
            <li key={`${recipe.id}-step-${index}`} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-700 bg-gray-950 text-xs font-semibold text-blue-400">
                {index + 1}
              </span>
              <span className="line-clamp-2 leading-6">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}
