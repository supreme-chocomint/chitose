function buildSearchPicker() {

  let searchPicker = document.getElementById("search-picker");
  let searches = ["Voice actor", "Anime", "Character"];
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
  let header = ` ${data.Media.title.romaji} characters`;

  window.currentDisplay.setCharacterBrowseHeader(header);
  tableBody.style.visibility = "hidden";  // to hide build process
  tableBody.innerHTML = "";

  for (let edge of data.Media.characters.edges) {
    let obj = parseCharacterBrowseData(edge);
    window.currentDisplay.addCharacterEntry("character-browse-table-body", obj.role, obj.onclick);
  }

  // See fillMediaSearchTable() comment
  let resize = false;
  window.currentDisplay.styleCharacterBrowseTable(resize);

  switchToPage(0, "ALL");
  setNavigationState(tableBody, pageSize, "ALL");
  tableBody.style.visibility = "";

}

function fillCharacterSearchTable(characters) {

  let tableBody = window.currentDisplay.characterBrowseTableBody;
  let pageSize = window.currentDisplay.tablePageSize;

  tableBody.style.visibility = "hidden";  // to hide build process
  tableBody.innerHTML = "";

  for (let character of characters) {
    let data = parseCharacterSearchData(character);
    if (data != null) {  // null => character not animated
      window.currentDisplay.addCharacterEntry("character-browse-table-body", data.role, data.onclick);
    }
  }

  // Same behaviour as media search table
  let resize = false;
  window.currentDisplay.styleCharacterBrowseTable(resize);

  switchToPage(0, "ALL");
  setNavigationState(tableBody, pageSize, "ALL");
  tableBody.style.visibility = "";

}

function fillVALanguageTable(characterName, voiceActors, hasMediaEntries) {

  window.currentDisplay.rolesTable.style.display = "none";
  window.currentDisplay.vaLanguageTable.style.display = "";

  let tableBody = window.currentDisplay.vaLanguageTableBody;
  let header = ` VAs for ${characterName}`;
  window.currentDisplay.setVaLanguageTableHeader(header);
  tableBody.innerHTML = "";

  for (let va of voiceActors) {
    window.currentDisplay.addVALanguageEntry(va);
  }

  if (hasMediaEntries) {
    window.currentDisplay.showEntriesVaLanguageTable();
  }
  else {
    window.currentDisplay.hideEntriesVaLanguageTable();
  }

  if (voiceActors.length == 0) {
    window.currentDisplay.addNoResultsIndicator(
      "va-language-table-body",
      `<br>It's possible this character didn't have a speaking role
      in the searched season/entry. Try searching under a different season
      (e.g. "Hibike Euphonium 2" instead of "Hibike Euphonium").`
    );
  }

}
