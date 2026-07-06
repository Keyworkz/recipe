import { ImagePlus, X } from "lucide-react";

export default function ImageUploader({ image, onChange, onRemove }) {
  return (
    <div>
      <label htmlFor="dish-image" className="block text-sm font-medium text-gray-200">
        Dish image
      </label>
      <div className="mt-2 overflow-hidden rounded-lg border border-gray-800 bg-gray-950">
        {image ? (
          <div>
            <img src={image} alt="Dish preview" className="h-72 w-full object-cover" />
            <div className="flex items-center justify-between border-t border-gray-800 p-3">
              <p className="text-sm text-gray-400">Image preview</p>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-gray-700 px-3 text-sm font-medium text-gray-200 transition hover:border-blue-500 hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor="dish-image"
            className="flex cursor-pointer flex-col items-center justify-center px-6 py-12 text-center transition hover:border-blue-500 hover:bg-gray-900"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-md border border-gray-800 bg-gray-900 text-blue-400">
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="mt-4 text-sm font-medium text-gray-100">
              Choose an optional dish image
            </span>
            <span className="mt-1 text-sm text-gray-500">PNG, JPG, or WebP</span>
          </label>
        )}
        <input
          id="dish-image"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => onChange(reader.result);
            reader.readAsDataURL(file);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
