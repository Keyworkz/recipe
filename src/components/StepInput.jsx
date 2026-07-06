import { Plus, X } from "lucide-react";

export default function StepInput({ value, onChange, onAdd, steps, onRemove }) {
  const canAdd = value.trim().length > 0;

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="recipe-step" className="block text-sm font-medium text-gray-200">
          Recipe step
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="recipe-step"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onAdd();
              }
            }}
            placeholder="Write one recipe sentence…"
            className="h-12 min-w-0 flex-1 rounded-md border border-gray-700 bg-gray-950 px-4 text-base text-gray-50 outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="button"
            onClick={onAdd}
            disabled={!canAdd}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-blue-500 bg-blue-600 text-white transition hover:border-blue-400 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500"
            aria-label="Add recipe step"
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      {steps.length > 0 && (
        <ol className="space-y-2" aria-label="Recipe steps">
          {steps.map((step, index) => (
            <li
              key={`${step}-${index}`}
              className="flex items-start gap-3 rounded-md border border-gray-800 bg-gray-950 p-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-gray-700 text-xs font-semibold text-blue-400">
                {index + 1}
              </span>
              <p className="min-w-0 flex-1 text-sm leading-6 text-gray-200">{step}</p>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-800 text-gray-500 transition hover:border-blue-500 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label={`Remove step ${index + 1}`}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
