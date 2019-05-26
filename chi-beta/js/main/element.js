function setDescription() {
  let descriptionBox = document.getElementById("description-text");
  descriptionBox.innerHTML = getDescriptionString();
}

function showMainTab() {
  let mainContainer = document.getElementById("main-container");
  let vaInfoContainer = document.getElementById("va-info-container");
  mainContainer.style.display = "";
  vaInfoContainer.style.display = "none";
}
