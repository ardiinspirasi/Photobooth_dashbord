const slide = document.getElementById("slide");

setInterval(() => {
  const img = localStorage.getItem("lastPhoto");
  if (img) slide.src = img;
}, 1500);
