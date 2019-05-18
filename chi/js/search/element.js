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
  tableBody.style.visibility = "";

}

function addMediaSearchEntry(media) {
  window.currentDisplay.addMediaSearchEntry(media);
}

function fillCharacterBrowseTable(data) {

  let tableBody = window.currentDisplay.characterBrowseTableBody;
  let pageSize = window.currentDisplay.tablePageSize;

  tableBody.style.visibility = "hidden";  // to hide build process
  tableBody.innerHTML = "";
  let entryCount = 0;

  for (let edge of data.Media.characters.edges) {
    console.log(edge.node.name);
    let role = {
      character: {
        image: edge.node.image.large,
        url: edge.node.siteUrl,
        name: parsedName(edge.node.name)
      },
      show: {
        siteUrl: data.Media.siteUrl,
        title: data.Media.title
      }
    }
    let onclick = function() {
      fillVALanguageTable(edge.voiceActors);
    }
    window.currentDisplay.addCharacterEntry("character-browse-table-body", role, onclick);
    let row = tableBody.lastChild;
    row.id = entryCount;
    entryCount++;
  }

  styleVATable();
  switchToPage(0, "ALL");
  setNavigationState(tableBody, pageSize, "ALL");
  tableBody.style.visibility = "";

}
