window.onload = function() {

  buildDisplayModes();
  let hasStorageAccess = setTheme();
  setOnEvents();

  // redirect if required; to main tab is default
  let redirect = tabRedirect();
  switch (redirect) {
    case "main":
      // build main in this case b/c window just loaded
      setMainTabLoaded(true);
      buildMainTab(hasStorageAccess);
      break;
    case "va-details":
      // va-details are built unconditionally, so handled by tabRedirect()
      // can't build main b/c depends on items being visible
      setMainTabLoaded(false);
      break;
  }

}

function setOnEvents() {
  setOnClicks();
  setOnKeyPresses();
  setOnHashChange();
  window.onresize = function() {
    window.currentDisplay.resetFixedDimensions();
  }
}

function buildMainTab(hasStorageAccess) {

  lock();
  setDescription();
  buildSeasonPickers();
  buildSearchPicker();
  buildLanguageFilter();
  clearSearchBar();
  clearTransferBox();

  clearVATable();  // For those with itchy trigger fingers
  setSeason("", "");  // Set to current season
  unclick();

  /* Callback hell, here we come.
  Need to search after default population so the results don't get replaced. */
  populateVATableWithSeason(searchFromHashIfNeeded);
  if (hasStorageAccess) { lock(); populateFollowTable(); }

}

function searchFromHashIfNeeded() {
  if (window.location.hash != "") {
    let hash = window.location.hash.split("#").join("");
    hash = hash.replace(/_/g, " "); /* underscores with spaces */
    try {
      hash = decodeURI(hash); /* try to replace %20 with space */
    } catch { /* Give up */ }

    window.location.hash = "";
    document.getElementById("search-bar").value = hash;
    document.getElementById("search-button").click();
  } 
}

function setOnClicks() {

  // Single clickables
  let searchButton = document.getElementById("search-button");
  let refreshButton = document.getElementById("refresh-button");
  let displayModeSwitch = document.getElementById("display-mode-switch");
  let darkModeSwitch = document.getElementById("dark-mode-switch");
  let leftTableSwitch = document.getElementById("left-table-switch");
  let importButton = document.getElementById("import-button");
  let exportButton = document.getElementById("export-button");
  let returnButton = document.getElementById("return-button");
  let allCharactersSwitch = document.getElementById("all-characters-switch");

  // Classes of clickables
  let characterSectionLinks = document.getElementsByClassName("character-section-link");

  // Typical events
  searchButton.onclick = function() { searchButtonOnClick(); }
  refreshButton.onclick = function() { refreshButtonOnClick(); }
  displayModeSwitch.onclick = function() { displayModeSwitchOnClick(); }
  darkModeSwitch.onclick = function() { darkModeSwitchOnClick(); }
  leftTableSwitch.onclick = function() { leftTableSwitchOnClick(); }
  importButton.onclick = function() { importButtonOnClick(); }
  exportButton.onclick = function() { exportButtonOnClick(); }
  returnButton.onclick = function() { returnButtonOnClick(); }
  allCharactersSwitch.onclick = function() { allCharactersSwitchOnClick(); }

  // Hyperlink-like behaviour
  // Require clicked element as reference
  for (let link of characterSectionLinks) {
    link.onclick = function(e) { characterSectionLinkOnClick(e); };
  }

  setNavigationOnClicks();

}

function setOnKeyPresses() {

  let searchBar = document.getElementById("search-bar");
  let ENTER = 13;

  searchBar.addEventListener("keyup", function(event) {
    if (event.keyCode == ENTER) {
      searchButtonOnClick();
    }
  });

}

function leftTableSwitchOnClick() {

  let vaTable = window.currentDisplay.vaTable;
  let followTable = window.currentDisplay.followTable;
  let followTableBody = window.currentDisplay.followTableBody;

  let searchBar = document.getElementById("search-bar");
  let searchPicker = document.getElementById("search-picker");
  let searchButton = document.getElementById("search-button");
  let refreshButton = document.getElementById("refresh-button");

  let navDiv = document.getElementById("navigation");
  let tranferDiv = document.getElementById("transfer");

  let state = vaTable.getAttribute("data-state");

  // switch to VAs
  if (vaTable.style.display == "none") {

    if (state == "season"){
      // make sure follow states are up-to-date
      // because refetching everything > writing a new function
      changed = followTableBody.getAttribute("data-changed");
      if (changed == "true") {
        clearVATable();
        populateVATableWithSeason();
        followTableBody.setAttribute("data-changed", "false");
      }
    }

    // there's probably a better way to turn these all off
    vaTable.style.display = "";
    followTable.style.display = "none";
    searchBar.disabled = false;
    searchPicker.disabled = false;
    searchButton.disabled = false;
    refreshButton.disabled = false;
    navDiv.style.display = "";
    tranferDiv.style.display = "none";

  }
  // switch to follows
  else {
    vaTable.style.display = "none";
    followTable.style.display = "";
    searchBar.disabled = true;
    searchPicker.disabled = true;
    searchButton.disabled = true;
    refreshButton.disabled = true;
    navDiv.style.display = "none";
    tranferDiv.style.display = "";
  }

}

function refreshButtonOnClick() {
  if (!isLocked()) {
    lock();
    document.getElementById("search-bar").value = "";
    clearVATable();
    clearRolesTable();
    unclick();
    populateVATableWithSeason();
  }
}
