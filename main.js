class Donation {
  constructor(amount) {
    this.amount = amount;
  }
}

// Cargar donaciones almacenadas en el local storage
const storedDonations = JSON.parse(localStorage.getItem("donations")) || [];
let donations = storedDonations.map(amount => new Donation(amount));

function donate() {
  const amount = parseInt($("#amount").val());

  if (isNaN(amount) || amount <= 0) {
    alert("Por favor, ingrese una cantidad válida.");
    return;
  }

  // Crear nueva donación y agregarla a la lista
  const newDonation = new Donation(amount);
  donations.push(newDonation);

  // Actualizar la lista de donaciones y guardar en el local storage
  updateDonationList();
  saveDonationsToLocalStorage();
  $("#amount").val("");
}

function updateDonationList() {
  $("#donationList").empty();

  // Calcular el total de donaciones
  const totalDonation = donations.reduce((total, donation) => total + donation.amount, 0);

  // Agregar cada donación a la lista
  donations.forEach((donation) => {
    const listItem = $("<li>").text("$" + donation.amount).addClass("donation-item");
    $("#donationList").append(listItem);
  });

  // Agregar el total al final de la lista
  const totalItem = $("<li>").text("Total: $" + totalDonation);
  $("#donationList").append(totalItem);
}

function saveDonationsToLocalStorage() {
  // Guardar las donaciones en el local storage
  localStorage.setItem("donations", JSON.stringify(donations.map(donation => donation.amount)));
}

// Agregar Donaciones
$("#donateButton").click(donate);

// Limpiar la lista de donaciones y el local storage
$("#clearButton").click(function () {
  
  donations = [];
  updateDonationList();
  saveDonationsToLocalStorage();
});

// Cargar donaciones desde el servidor al cargar la página
$(document).ready(function () {
  updateDonationList();
  loadDonationsFromServer();
});

function loadDonationsFromServer() {
  fetch('URL')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      donations = data.map(amount => new Donation(amount));
      updateDonationList();
      saveDonationsToLocalStorage();
    })
    .catch(error => {
      console.error("Error al cargar los datos de donaciones: " + error);
    });
}
