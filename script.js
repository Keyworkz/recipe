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

const viewButtons = document.querySelectorAll("[data-view]");
const selectModeButton = document.getElementById("select-mode-button");
const deleteSelectedButton = document.getElementById("delete-selected-button");
const themeToggleButton = document.getElementById("theme-toggle");
const homeView = document.getElementById("home-view");
const detailView = document.getElementById("detail-view");
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
const detailTitle = document.getElementById("detail-title");
const detailDescription = document.getElementById("detail-description");
const ingredientList = document.getElementById("ingredient-list");
const ingredientInput = document.getElementById("ingredient-input");
const addIngredientButton = document.getElementById("add-ingredient-button");
const saveDetailButton = document.getElementById("save-detail-button");
const closeDetailButton = document.getElementById("close-detail-button");

let steps = [];
let imageData = null;
let recipes = [];
let isSelectMode = false;
let selectedRecipeIds = new Set();
let isLightTheme = false;
let activeRecipeId = null;
let activeRecipeIngredients = [];

function getSavedRecipes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Could not read saved recipes", error);
    return [];
  }
}

function getStoredTheme() {
  try {
    return localStorage.getItem("recipe_vault_theme");
  } catch (error) {
    return null;
  }
}

function saveRecipes(savedRecipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedRecipes));
}

function loadRecipes() {
  const savedRecipes = getSavedRecipes();
  recipes = [...savedRecipes, ...sampleRecipes];
}

function applyTheme(theme) {
  isLightTheme = theme === "light";
  document.body.classList.toggle("light-theme", isLightTheme);
  themeToggleButton.textContent = isLightTheme ? "🌙" : "☀️";
}

function setTheme(theme) {
  isLightTheme = theme === "light";
  localStorage.setItem("recipe_vault_theme", theme);
  applyTheme(theme);
}

function getAllRecipes() {
  return recipes;
}

function toggleView(view) {
  if (view === "new") {
    homeView.classList.add("hidden");
    detailView.classList.add("hidden");
    newView.classList.remove("hidden");
  } else if (view === "detail") {
    homeView.classList.add("hidden");
    newView.classList.add("hidden");
    detailView.classList.remove("hidden");
  } else {
    homeView.classList.remove("hidden");
    detailView.classList.add("hidden");
    newView.classList.add("hidden");
  }

  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
}

function updateSelectionUi() {
  selectModeButton.classList.toggle("active", isSelectMode);
  selectModeButton.textContent = isSelectMode ? "Cancel" : "Select";
  deleteSelectedButton.classList.toggle(
    "hidden",
    !isSelectMode || selectedRecipeIds.size === 0,
  );
}

function toggleRecipeSelection(recipeId) {
  if (selectedRecipeIds.has(recipeId)) {
    selectedRecipeIds.delete(recipeId);
  } else {
    selectedRecipeIds.add(recipeId);
  }

  renderRecipes();
}

function deleteSelectedRecipes() {
  if (selectedRecipeIds.size === 0) return;

  const selectedIds = [...selectedRecipeIds];
  recipes = recipes.filter((recipe) => !selectedIds.includes(recipe.id));

  const savedRecipes = recipes.filter(
    (recipe) =>
      !sampleRecipes.some((sampleRecipe) => sampleRecipe.id === recipe.id),
  );

  saveRecipes(savedRecipes);
  selectedRecipeIds.clear();
  renderRecipes();
}

function openRecipeDetail(recipeId) {
  const recipe = recipes.find((item) => item.id === recipeId);
  if (!recipe) return;

  activeRecipeId = recipeId;
  activeRecipeIngredients = [...(recipe.ingredients || [])];
  detailTitle.textContent = recipe.title;
  detailDescription.value = recipe.description || "";
  renderIngredients();
  toggleView("detail");
}

function renderIngredients() {
  ingredientList.innerHTML = "";

  if (activeRecipeIngredients.length === 0) {
    const emptyState = document.createElement("p");
    emptyState.className = "section-copy";
    emptyState.textContent = "No ingredients yet.";
    ingredientList.appendChild(emptyState);
    return;
  }

  activeRecipeIngredients.forEach((ingredient, index) => {
    const item = document.createElement("div");
    item.className = "ingredient-item";

    const text = document.createElement("span");
    text.textContent = ingredient;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-ingredient";
    removeButton.textContent = "×";
    removeButton.addEventListener("click", () => {
      activeRecipeIngredients = activeRecipeIngredients.filter(
        (_, itemIndex) => itemIndex !== index,
      );
      renderIngredients();
    });

    item.appendChild(text);
    item.appendChild(removeButton);
    ingredientList.appendChild(item);
  });
}

function saveRecipeDetail() {
  if (!activeRecipeId) return;

  const recipeIndex = recipes.findIndex(
    (recipe) => recipe.id === activeRecipeId,
  );
  if (recipeIndex === -1) return;

  recipes[recipeIndex] = {
    ...recipes[recipeIndex],
    description: detailDescription.value.trim(),
    ingredients: [...activeRecipeIngredients],
  };

  const savedRecipes = recipes.filter(
    (recipe) =>
      !sampleRecipes.some((sampleRecipe) => sampleRecipe.id === recipe.id),
  );
  saveRecipes(savedRecipes);
  renderRecipes();
  toggleView("home");
}

function createRecipeCard(recipe) {
  const card = document.createElement("article");
  card.className = "recipe-card";

  if (isSelectMode) {
    card.classList.add("selectable");
  }

  if (selectedRecipeIds.has(recipe.id)) {
    card.classList.add("selected");
  }

  const selectionBadge = document.createElement("button");
  selectionBadge.type = "button";
  selectionBadge.className = "selection-badge";
  selectionBadge.textContent = selectedRecipeIds.has(recipe.id) ? "✓" : "";
  selectionBadge.setAttribute(
    "aria-label",
    selectedRecipeIds.has(recipe.id) ? "Deselect recipe" : "Select recipe",
  );

  if (isSelectMode) {
    selectionBadge.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleRecipeSelection(recipe.id);
    });
  }

  card.addEventListener("click", () => {
    if (isSelectMode) {
      toggleRecipeSelection(recipe.id);
      return;
    }

    openRecipeDetail(recipe.id);
  });

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

  card.appendChild(selectionBadge);
  card.appendChild(imageWrapper);
  card.appendChild(recipeBody);
  return card;
}

function renderRecipes() {
  recipeGrid.innerHTML = "";
  const recipesToRender = getAllRecipes();

  recipesToRender.forEach((recipe) => {
    recipeGrid.appendChild(createRecipeCard(recipe));
  });

  updateSelectionUi();
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

function addIngredient() {
  const value = ingredientInput.value.trim();
  if (!value) return;
  activeRecipeIngredients.push(value);
  ingredientInput.value = "";
  renderIngredients();
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.view) {
      toggleView(button.dataset.view);
    }
  });
});

selectModeButton.addEventListener("click", () => {
  isSelectMode = !isSelectMode;

  if (!isSelectMode) {
    selectedRecipeIds.clear();
  }

  renderRecipes();
});

themeToggleButton.addEventListener("click", () => {
  const nextTheme = isLightTheme ? "dark" : "light";
  setTheme(nextTheme);
});

deleteSelectedButton.addEventListener("click", deleteSelectedRecipes);

addStepButton.addEventListener("click", addStep);
addIngredientButton.addEventListener("click", addIngredient);

stepInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addStep();
  }
});

ingredientInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addIngredient();
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

  const newRecipe = {
    id: `saved-${Date.now()}`,
    title,
    description:
      "A saved recipe with precise steps and a calm place to return.",
    steps: [...steps],
    image: imageData,
  };

  recipes = [newRecipe, ...recipes];
  const savedRecipes = recipes.filter(
    (recipe) =>
      !sampleRecipes.some((sampleRecipe) => sampleRecipe.id === recipe.id),
  );

  saveRecipes(savedRecipes);
  resetForm();
  renderRecipes();
  toggleView("home");
});

cancelButton.addEventListener("click", () => {
  resetForm();
  toggleView("home");
});

saveDetailButton.addEventListener("click", saveRecipeDetail);
closeDetailButton.addEventListener("click", () => {
  activeRecipeId = null;
  toggleView("home");
});

titleInput.addEventListener("input", updateSaveButtonState);
stepInput.addEventListener("input", updateSaveButtonState);

loadRecipes();
const savedTheme = getStoredTheme() || "dark";
applyTheme(savedTheme);
renderRecipes();
resetForm();
