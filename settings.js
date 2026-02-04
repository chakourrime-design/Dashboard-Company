
// Déconnexion
function logout() {
  localStorage.removeItem("authenticated");
  window.location.href = "login.html";
}
