function isFetchingDetails() {
  let id = document.getElementById("va-info-container").getAttribute("data-fetching");
  return (id == null || id == 0) ? false : true;
}

function setFetchingDetails(voiceActorId) {
  document.getElementById("va-info-container").setAttribute("data-fetching", voiceActorId);
  document.getElementById("fetch-icon").innerHTML = "ア";
  document.getElementById("fetch-icon").style.display = "";
}

function unsetFetchingDetails() {
  document.getElementById("va-info-container").setAttribute("data-fetching", 0);
  document.getElementById("fetch-icon").innerHTML = "";
  document.getElementById("fetch-icon").style.display = "none";
}

function getFetchingDetailsId() {
  let id = document.getElementById("va-info-container").getAttribute("data-fetching");
  return (id == null) ? 0 : id;
}
