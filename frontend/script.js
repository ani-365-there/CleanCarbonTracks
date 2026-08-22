const button = document.querySelector("button");
const message = document.getElementById("message");

button.addEventListener("click", () => {
  message.classList.remove("hidden");
  message.textContent = "✅ Pickup booked successfully!";
  
  // Optional: reset after 3 seconds
  setTimeout(() => {
    message.classList.add("hidden");
  }, 3000);
});
// Handle showing pickup instructions
const wasteSelect = document.querySelector("select");
const instruction = document.getElementById("instruction");

wasteSelect.addEventListener("change", function() {
  const type = this.value.toLowerCase();
  instruction.classList.remove("hidden");

  switch(type) {
    case "plastic":
      instruction.textContent = "♻️ Please rinse and flatten bottles or containers before pickup.";
      break;
    case "organic":
      instruction.textContent = "🌱 Keep food waste in a sealed biodegradable bag to prevent leakage.";
      break;
    case "paper":
      instruction.textContent = "📄 Keep paper dry and separate from wet waste for easy recycling.";
      break;
    case "metal":
      instruction.textContent = "⚙️ Rinse and store cans or tins safely to avoid injury.";
      break;
    default:
      instruction.textContent = "ℹ️ Please ensure waste is properly segregated before pickup.";
  }
});
function categorizeWaste() {
  const input = document.getElementById('wasteInput').value.toLowerCase().trim();
  const result = document.getElementById('wasteResult');

  let category = '';

  if (!input) {
    result.textContent = '⚠️ Please enter an item.';
  } else if (input.includes('plastic') || input.includes('bottle')) {
    category = 'Non-biodegradable (Plastic)';
  } else if (input.includes('banana') || input.includes('food') || input.includes('leaf')) {
    category = 'Biodegradable (Organic)';
  } else if (input.includes('paper') || input.includes('box')) {
    category = 'Recyclable (Paper)';
  } else if (input.includes('metal') || input.includes('can')) {
    category = 'Recyclable (Metal)';
  } else {
    category = 'Unknown — please check local guidelines';
  }

  result.textContent = `🗑️ Category: ${category}`;
  result.classList.remove('hidden');
}
