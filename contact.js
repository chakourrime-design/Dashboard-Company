
// Déconnexion
function logout() {
  localStorage.removeItem("authenticated");
  window.location.href = "login.html";
}

// Formulaire de contact simulé
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Simulation envoi message
  successMessage.style.display = "block";

  // Réinitialiser le formulaire
  form.reset();

  // Cacher le message après 3s
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);
});
