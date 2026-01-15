document.getElementById("clearPhotos").addEventListener("click", () => {
  localStorage.removeItem("lastPhoto");
  alert("Foto dihapus");
});
