window.onload = function() {

  let body = document.getElementsByTagName("body")[0];
  let defaultTheme = "light";

  hasStorageAccess = setStorageState();  // handle browser disabling cookies
  if (hasStorageAccess) {
    let set = setThemeFromStorage();
    if (!set) {
      body.classList.add(defaultTheme);
    }
  }
  else {
    body.classList.add(defaultTheme);
  }

  setOnClicks();
  setOnKeyPresses();
  setDescription();
  hideElements();
  buildSeasonPickers();
  clearInputBoxes();

  clearVATable();  // For those with itchy trigger fingers
  setSeason("", "");  // Set to current season
  window.mediaFormats = ["TV", "ONA", "TV_SHORT"];
  populateVATableWithSeason();

  if (hasStorageAccess) { populateFollowTable(); }

}

function setOnClicks() {

  let searchButton = document.getElementById("search-button");
  let refreshButton = document.getElementById("refresh-button");
  let darkModeSwitch = document.getElementById("dark-mode-switch");
  let leftTableSwitch = document.getElementById("left-table-switch");
  let importButton = document.getElementById("import-button");
  let exportButton = document.getElementById("export-button");

  searchButton.onclick = function() { searchButtonOnClick(); }
  refreshButton.onclick = function() { refreshButtonOnClick(); }
  darkModeSwitch.onclick = function() { darkModeSwitchOnClick(); }
  leftTableSwitch.onclick = function() { leftTableSwitchOnClick(); }
  importButton.onclick = function() { importButtonOnClick(); }
  exportButton.onclick = function() { exportButtonOnClick(); }
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

function populateVATableWithSeason() {

  let quarterElement = document.getElementById("quarter-picker");
  let vaTableCaption = document.getElementById("va-table-caption");

  let quarter = quarterElement.options[quarterElement.selectedIndex].value.toUpperCase();
  let year = document.getElementById("year-picker").value;
  let variables = {
      perPage: 50,
      page: 1,
      season: quarter,
      seasonYear: year,
  };

  lock();
  window.voiceActors = {};
  vaTableCaption.setAttribute("data-content", " VAs for " + parsedSeason(quarter, year));
  for (let format of window.mediaFormats) {
    variables.format = format;
    makeRequest(getQuery(""), variables, collectSeasonalVAsCallback);
  }

}

function populateFollowTable() {

  let following = getFollowing();
  let idArray = Object.keys(following);

  lock();
  for (let id of idArray) {
    let variables = { id: id };
    makeRequest(
      getQuery("VA ID"),
      variables,
      function(data) {
        // Need length to unlock when done
        collectFollowingCallback(idArray.length, data);
      }
    );
  }

}

function isLocked() {
  return document.getElementsByTagName("body")[0].classList.contains("locked");
}

function lock() {
  document.getElementsByTagName("body")[0].classList.add("locked");
}

function unlock() {
  document.getElementsByTagName("body")[0].classList.remove("locked");
}

function fetchTheme() {
  let themeString = localStorage.getItem("theme");
  return themeString;
}

function saveTheme(themeString) {
  localStorage.setItem("theme", themeString);
}

function setThemeFromStorage(defaultTheme) {

  let body = document.getElementsByTagName("body")[0];
  let theme = fetchTheme();
  let set = false;

  if (theme) {
    body.classList.add(theme);
    set = true;
  }

  switch (theme) {
    case "light":
      document.getElementById("dark-mode-switch").value = "Turn Dark Mode On";
      break;
    case "dark":
      document.getElementById("dark-mode-switch").value = "Turn Dark Mode Off";
      break;
    default:
  }

  return set;

}
