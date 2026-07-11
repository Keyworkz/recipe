const STORAGE_KEY = "recipe_vault_recipes";

const sampleRecipes = [
  {
    id: "sample-1",
    title: "Blue hour risotto",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.",
    steps: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing.",
      "Suspendisse potenti cras mattis nibh.",
    ],
    image: null,
  },
  {
    id: "sample-2",
    title: "Midnight noodles",
    description:
      "Sed posuere consectetur est at lobortis. Donec ullamcorper nulla non metus auctor.",
    steps: [
      "Praesent commodo cursus magna vel scelerisque.",
      "Aenean lacinia bibendum nulla sed consectetur.",
    ],
    image: null,
  },
  {
    id: "sample-3",
    title: "Cloud broth",
    description:
      "Maecenas faucibus mollis interdum. Curabitur blandit tempus porttitor.",
    steps: [
      "Etiam porta sem malesuada magna mollis.",
      "Cras justo odio, dapibus ac facilisis.",
    ],
    image: null,
  },
  {
    id: "sample-4",
    title: "Quiet berry tart",
    description:
      "Nullam quis risus eget urna mollis ornare vel eu leo. Vestibulum id ligula porta.",
    steps: [
      "Vivamus sagittis lacus vel augue laoreet.",
      "Morbi leo risus, porta ac consectetur.",
    ],
    image: null,
  },
];

const navButtons = document.querySelectorAll(".nav-button");
const homeView = document.getElementById("home-view");
const newView = document.getElementById("new-view");
const recipeGrid = document.getElementById("recipe-grid");
const recipeForm = document.getElementById("recipe-form");
const titleInput = document.getElementById("recipe-title");
const stepInput = document.getElementById("recipe-step");
const addStepButton = document.getElementById("add-step-button");
const stepList = document.getElementById("step-list");
const imageUploader = document.getElementById("image-uploader");
const dishImageInput = document.getElementById("dish-image");
const saveButton = document.getElementById("save-button");
const cancelButton = document.getElementById("cancel-button");

let steps = [];
let imageData = null;

function getSavedRecipes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Could not read saved recipes", error);
    return [];
  }
}

function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

function getAllRecipes() {
  return [...getSavedRecipes(), ...sampleRecipes];
}

function toggleView(view) {
  if (view === "new") {
    homeView.classList.add("hidden");
    newView.classList.remove("hidden");
  } else {
    homeView.classList.remove("hidden");
    newView.classList.add("hidden");
  }

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
}

function createRecipeCard(recipe) {
  const card = document.createElement("article");
  card.className = "recipe-card";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "recipe-image";

  if (recipe.image) {
    const img = document.createElement("img");
    img.src = recipe.image;
    img.alt = recipe.title;
    imageWrapper.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "placeholder";
    placeholder.textContent = "IMG";
    imageWrapper.appendChild(placeholder);
  }

  const recipeBody = document.createElement("div");
  recipeBody.className = "recipe-body";

  const title = document.createElement("h2");
  title.textContent = recipe.title;

  const description = document.createElement("p");
  description.textContent = recipe.description;

  const stepsList = document.createElement("div");
  stepsList.className = "steps-list";

  recipe.steps.slice(0, 2).forEach((step, index) => {
    const stepItem = document.createElement("div");
    stepItem.className = "step-item";

    const stepNumber = document.createElement("div");
    stepNumber.className = "step-number";
    stepNumber.textContent = index + 1;

    const stepText = document.createElement("span");
    stepText.className = "step-item-text";
    stepText.textContent = step;

    stepItem.appendChild(stepNumber);
    stepItem.appendChild(stepText);
    stepsList.appendChild(stepItem);
  });

  recipeBody.appendChild(title);
  recipeBody.appendChild(description);
  recipeBody.appendChild(stepsList);

  card.appendChild(imageWrapper);
  card.appendChild(recipeBody);
  return card;
}

function renderRecipes() {
  recipeGrid.innerHTML = "";
  const recipes = getAllRecipes();

  recipes.forEach((recipe) => {
    recipeGrid.appendChild(createRecipeCard(recipe));
  });
}

function updateStepList() {
  stepList.innerHTML = "";

  steps.forEach((step, index) => {
    const item = document.createElement("li");
    item.className = "step-list-item";

    const number = document.createElement("span");
    number.className = "step-number";
    number.textContent = index + 1;

    const text = document.createElement("span");
    text.className = "step-item-text";
    text.textContent = step;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-step";
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      steps = steps.filter((_, itemIndex) => itemIndex !== index);
      updateStepList();
      updateSaveButtonState();
    });

    item.appendChild(number);
    item.appendChild(text);
    item.appendChild(removeButton);
    stepList.appendChild(item);
  });
}

function updateSaveButtonState() {
  const canSave = titleInput.value.trim().length > 0 && steps.length > 0;
  saveButton.disabled = !canSave;
}

function resetForm() {
  titleInput.value = "";
  stepInput.value = "";
  steps = [];
  imageData = null;
  updateStepList();
  updateSaveButtonState();
  renderImagePreview();
}

function renderImagePreview() {
  const preview = imageUploader.querySelector(".image-preview");
  if (preview) {
    preview.remove();
  }

  if (!imageData) {
    return;
  }

  const previewCard = document.createElement("div");
  previewCard.className = "image-preview";

  const img = document.createElement("img");
  img.src = imageData;
  img.alt = "Image preview";
  previewCard.appendChild(img);

  const footer = document.createElement("div");
  footer.className = "image-preview-footer";

  const label = document.createElement("p");
  label.textContent = "Image preview";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-image";
  removeButton.textContent = "Remove image";
  removeButton.addEventListener("click", () => {
    imageData = null;
    dishImageInput.value = "";
    renderImagePreview();
  });

  footer.appendChild(label);
  footer.appendChild(removeButton);
  previewCard.appendChild(footer);
  imageUploader.appendChild(previewCard);
}

function addStep() {
  const value = stepInput.value.trim();
  if (!value) return;
  steps.push(value);
  stepInput.value = "";
  updateStepList();
  updateSaveButtonState();
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleView(button.dataset.view);
  });
});

addStepButton.addEventListener("click", addStep);

stepInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addStep();
  }
});

dishImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imageData = reader.result;
    renderImagePreview();
  };
  reader.readAsDataURL(file);
});

recipeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title || steps.length === 0) return;

  const savedRecipes = getSavedRecipes();
  const newRecipe = {
    id: `saved-${Date.now()}`,
    title,
    description:
      "A saved recipe with precise steps and a calm place to return.",
    steps: [...steps],
    image: imageData,
  };

  saveRecipes([newRecipe, ...savedRecipes]);
  resetForm();
  renderRecipes();
  toggleView("home");
});

cancelButton.addEventListener("click", () => {
  resetForm();
  toggleView("home");
});

titleInput.addEventListener("input", updateSaveButtonState);
stepInput.addEventListener("input", updateSaveButtonState);

renderRecipes();
resetForm();
