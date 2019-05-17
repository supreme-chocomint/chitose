function buildSearchPicker() {

  let searchPicker = document.getElementById("search-picker");
  let searches = ["Voice actor", "Show", "Character"];
  let searchCodes = ["VA SEARCH", "ANIME SEARCH", "CHARACTER SEARCH"];

  for (let i = 0; i < searches.length; i++) {
    let option = document.createElement("option");
    option.value = searchCodes[i];
    option.innerHTML = searches[i];
    searchPicker.appendChild(option);
  }
  searchPicker.onchange = function() {
    document.getElementById("tool-help").innerHTML = getExplainString();
  };

}

function fillMediaSearchTable(media) {

  let tableBody = window.currentDisplay.searchTableBody;
  let pageSize = window.currentDisplay.tablePageSize;

  tableBody.style.visibility = "hidden";  // to hide build process
  let entryCount = 0;

  for (let m of media) {
    addMediaSearchEntry(m);
    let row = tableBody.lastChild;
    row.id = entryCount;
    entryCount++;
  }

  styleVATable();
  switchToPage(0, "ALL");
  setNavigationState(tableBody, pageSize, "ALL");

}

function addMediaSearchEntry(media) {
  window.currentDisplay.addMediaSearchEntry(media);
}
