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

  // Table often really large due to one long-named entry,
  // so just rely on scroll repositioning from page navigation clicks.
  // Also this table is the lowest element, so no issues with scroll-only.
  let resize = false;
  window.currentDisplay.styleMediaSearchTable(resize);
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
    let name = parsedName(edge.node.name);
    let role = {
      character: {
        image: edge.node.image.large,
        url: edge.node.siteUrl,
        name: name
      },
      show: {
        siteUrl: data.Media.siteUrl,
        title: data.Media.title
      }
    }
    let onclick = function() {
      fillVALanguageTable(name, edge.voiceActors);
    }
    window.currentDisplay.addCharacterEntry("character-browse-table-body", role, onclick);
    let row = tableBody.lastChild;
    row.id = entryCount;
    entryCount++;
  }

  // See fillMediaSearchTable() comment
  let resize = false;
  window.currentDisplay.styleCharacterBrowseTable(resize);

  switchToPage(0, "ALL");
  setNavigationState(tableBody, pageSize, "ALL");
  tableBody.style.visibility = "";

}

function fillVALanguageTable(characterName, voiceActors) {

  let tableBody = window.currentDisplay.vaLanguageTableBody;
  let header = ` VAs for ${characterName}`;
  window.currentDisplay.setVaLanguageTableHeader(header);
  tableBody.innerHTML = "";

  for (let va of voiceActors) {
    window.currentDisplay.addVALanguageEntry(va);
  }

  if (voiceActors.length == 0) {
    window.currentDisplay.addNoResultsIndicator(
      "va-language-table-body",
      `It's possible this character didn't have a speaking role
      in the searched season/entry. Try searching under a different season
      (e.g. Hibike Euphonium 2 instead of Hibike Euphonium).`
    );
  }

}
