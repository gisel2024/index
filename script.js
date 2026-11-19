
const cars = [
  { id: 1, brand: "Tesla",      model: "Model 3",  type: "Electric", price: 75,  seats: 5, gear: "Automatic", image: "https://images.unsplash.com/photo-1648866892162-9336ef9182e2?w=1200&h=800&fit=crop&q=85" },
  { id: 2, brand: "Ford",       model: "Mustang",  type: "Sport",    price: 130, seats: 4, gear: "Automatic", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_QoxQbSgXtBugQVbemhg7JWGqRKPTVZCb51bHWWcQoYw4S4Hjkse9phs&s=10" },
  { id: 3, brand: "Range Rover", model: "Sport",   type: "SUV",      price: 110, seats: 5, gear: "Automatic", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSovwLQaKieKnKDtLYOPIibJGLGxmUA-aY2DtcJ-jwC2Q&s=10" },
  { id: 4, brand: "Mini",       model: "Cooper",   type: "Economy",  price: 40,  seats: 4, gear: "Manual",    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Izfjj_msNVXVX8F4ejb5vDBVEJdXKZxE0mg8HuKS8w&s=10" }
  
];


const grid = document.getElementById("carGrid");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("search");
const typeSelect = document.getElementById("type");
const sortSelect = document.getElementById("sort");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const totalText = document.getElementById("total");
const modalError = document.getElementById("modalError");

let selectedCar = null; 

function showCars() {
  const text = searchInput.value.toLowerCase();
  const type = typeSelect.value;
  const sort = sortSelect.value;

 
  let list = cars.filter(function (car) {
    const name = (car.brand + " " + car.model).toLowerCase();
    return name.includes(text) && (type === "all" || car.type === type);
  });

  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);


  grid.innerHTML = "";
  list.forEach(function (car) {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<img src="' + car.image + '" alt="' + car.brand + " " + car.model + '" />' +
      '<div class="card-body">' +
        "<h3>" + car.brand + " " + car.model + "</h3>" +
        '<p class="muted">' + car.type + " · " + car.seats + " seats · " + car.gear + "</p>" +
        '<p class="price">€' + car.price + " <span>/ day</span></p>" +
        '<button class="btn" data-id="' + car.id + '">Book</button>' +
      "</div>";
    grid.appendChild(card);
  });

  noResults.hidden = list.length !== 0;
}

searchInput.addEventListener("input", showCars);
typeSelect.addEventListener("change", showCars);
sortSelect.addEventListener("change", showCars);


grid.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  openBooking(Number(button.dataset.id));
});
function openBooking(id) {
 
  if (!localStorage.getItem("user")) {
    window.location.href = "register.html";
    return;
  }

  selectedCar = cars.find((car) => car.id === id);
  modalTitle.textContent = "Book " + selectedCar.brand + " " + selectedCar.model;
  modalPrice.textContent = "€" + selectedCar.price + " per day";
  startInput.value = "";
  endInput.value = "";
  startInput.min = today();
  endInput.min = today();
  totalText.textContent = "Choose your dates to see the total.";
  modalError.hidden = true;
  modal.hidden = false;
}

function closeBooking() {
  modal.hidden = true;
}

function today() {
  return new Date().toISOString().split("T")[0]; 
}

function countDays() {
  if (!startInput.value || !endInput.value) return 0;
  const ms = new Date(endInput.value) - new Date(startInput.value);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function updateTotal() {
  const days = countDays();
  if (days > 0) {
    totalText.textContent = days + " day(s) × €" + selectedCar.price + " = €" + days * selectedCar.price;
  } else {
    totalText.textContent = "Choose your dates to see the total.";
  }
}

startInput.addEventListener("change", updateTotal);
endInput.addEventListener("change", updateTotal);

document.getElementById("confirmBtn").addEventListener("click", function () {
  if (!startInput.value || !endInput.value) {
    return showModalError("Pick a start and an end date.");
  }
  if (countDays() <= 0) {
    return showModalError("The end date must be after the start date.");
  }
  const days = countDays();
  closeBooking();
  showToast(selectedCar.brand + " " + selectedCar.model + " booked for " + days + " day(s). Total: €" + days * selectedCar.price);
});

function showModalError(message) {
  modalError.textContent = message;
  modalError.hidden = false;
}

document.getElementById("closeModal").addEventListener("click", closeBooking);
modal.addEventListener("click", function (event) {
  if (event.target === modal) closeBooking(); 
});

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(function () { toast.hidden = true; }, 4000);
}

// butoni register
function updateHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  const registerBtn = document.getElementById("registerBtn");
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    registerBtn.hidden = true;
    welcome.hidden = false;
    welcome.textContent = "Hi, " + user.name;
    logoutBtn.hidden = false;
  } else {
    registerBtn.hidden = false;
    welcome.hidden = true;
    logoutBtn.hidden = true;
  }
}

document.getElementById("logoutBtn").addEventListener("click", function () {
  localStorage.removeItem("user");
  updateHeader();
  showToast("You are logged out.");
});


updateHeader();
showCars();
