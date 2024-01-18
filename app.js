let mealsData = [];

// Function to create a meal card
function createMealCard(meal) {
  const card = document.createElement("div");
  card.classList.add("col-md-4", "mb-4");

  card.innerHTML = `
         <div class="card">
             <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
             <div class="card-body">
                 <h5 class="card-title">${meal.strMeal}</h5>
                 <p class="card-text">Category: ${meal.strCategory}</p>
                 <p class="card-text">Area: ${meal.strArea}</p>
                 <button class="btn btn-primary" data-toggle="modal" data-target="#mealDetailsModal"
                     onclick="showMealDetails(${meal.idMeal})">View Details</button>
             </div>
         </div>
     `;

  return card;
}

// Function to show meal details in the modal
function showMealDetails(mealId) {
  let mealsData = JSON.parse(localStorage.getItem("mealsData")) || [];
  const meal = mealsData.find((m) => parseInt(m.idMeal) === mealId);

  if (meal) {
    const modalContent = document.getElementById("mealDetailsContent");

    // Create an array of ingredient and measure pairs
    const ingredientPairs = [];
    for (let i = 1; i <= 20; i++) {
      const ingredientKey = `strIngredient${i}`;
      const measureKey = `strMeasure${i}`;
      const ingredient = meal[ingredientKey];
      const measure = meal[measureKey];

      if (ingredient && measure) {
        ingredientPairs.push({
          ingredient,
          measure,
        });
      }
    }

    // Generate the HTML for ingredient pairs
    const ingredientHTML = ingredientPairs
      .map(
        (pair) =>
          `<li><strong>${pair.ingredient}:</strong> ${pair.measure}</li>`
      )
      .join("");

    modalContent.innerHTML = `
       <strong>Ingredients:</strong>
         <ul>${ingredientHTML}</ul>
         <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
       `;

    // Show the modal
    $("#mealDetailsModal").modal("show");
  }
}

// Function to fetch data based on the search term
async function fetchMealsBySearchTerm(searchTerm) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
  );
  const data = await response.json();
  return data.meals || [];
}

// Function to trigger search based on user input
async function searchMeals() {
  const searchTerm = document.getElementById("searchInput").value;
  const mealCardsContainer = document.getElementById("mealCardsContainer");
  const modalContent = document.getElementById("mealDetailsContent");

  // Clear previous search results and modal content
  mealCardsContainer.innerHTML = "";
  modalContent.innerHTML = "";

  if (searchTerm.trim() !== "") {
    // Fetch and display meals based on the new search term
    const searchResults = await fetchMealsBySearchTerm(searchTerm);

    // Store search results in mealsData
    mealsData = searchResults;

    // Store search results in localStorage
    localStorage.setItem("mealsData", JSON.stringify(searchResults));

    searchResults.forEach((meal) => {
      const card = createMealCard(meal);
      mealCardsContainer.appendChild(card);
    });
  }
}

// Function to initialize the page
async function initPage() {
  const mealCardsContainer = document.getElementById("mealCardsContainer");

  // Check if there is data in local storage
  const storedMealsData = JSON.parse(localStorage.getItem("mealsData"));

  if (storedMealsData && storedMealsData.length > 0) {
    // If data exists, use it to populate the page
    storedMealsData.forEach((meal) => {
      const card = createMealCard(meal);
      mealCardsContainer.appendChild(card);
    });
  } 
}

// Initialize the page when the DOM is ready
document.addEventListener("DOMContentLoaded", initPage);
