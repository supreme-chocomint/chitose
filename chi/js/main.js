window.onload = function() {

  window.mediaFormats = ["TV", "ONA", "TV_SHORT"];
  window.voiceActors = {};
  window.seasonalRolesCounter = {};  // must be preserved across requests
  window.seasonRawData = {};
  window.seasonRawDataIndex = 0;

  let body = document.getElementsByTagName("body")[0];
  let defaultTheme = "light";

  let hasStorageAccess = setStorageState();  // handle browser disabling cookies
  if (hasStorageAccess) {
    let themeIsSet = setThemeFromStorage();
    if (!themeIsSet) {
      body.classList.add(defaultTheme);
    }
  }
  else {
    body.classList.add(defaultTheme);
  }

  setOnClicks();
  setOnKeyPresses();
  setLongFormText();
  buildSeasonPickers();
  clearInputBoxes();

  clearVATable();  // For those with itchy trigger fingers
  setSeason("", "");  // Set to current season

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
  let returnButton = document.getElementById("return-button");

  searchButton.onclick = function() { searchButtonOnClick(); }
  refreshButton.onclick = function() { refreshButtonOnClick(); }
  darkModeSwitch.onclick = function() { darkModeSwitchOnClick(); }
  leftTableSwitch.onclick = function() { leftTableSwitchOnClick(); }
  importButton.onclick = function() { importButtonOnClick(); }
  exportButton.onclick = function() { exportButtonOnClick(); }
  returnButton.onclick = function() { returnButtonOnClick(); }
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
  let vaTable = document.getElementById("va-table");
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
  clearSeasonSpecificData();
  vaTable.setAttribute("data-state", "season");
  vaTableCaption.setAttribute("data-content", " VAs for " + parsedSeason(quarter, year));

  // get from cache if it exists, otherwise do request
  if (window.seasonRawData[year] && window.seasonRawData[year][quarter]) {
    for (let i = 0; i < window.mediaFormats.length; i++) {
      let data = window.seasonRawData[year][quarter][i];
      extractVAs(window.seasonalRolesCounter, window.voiceActors, data);
    }
    sortedSeasonalVoiceActorIds = sortVaIdsByNumRoles(window.seasonalRolesCounter, window.voiceActors);
    fillVATableAndPage(sortedSeasonalVoiceActorIds);
    unlock();
  }
  else {
    for (let format of window.mediaFormats) {
      variables.format = format;
      makeRequest(
        getQuery(""),
        variables,
        function(data) {
          // Need season to cache raw data
          collectSeasonalVAsCallback(year, quarter, data);
        }
      );
    }
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

function clearSeasonSpecificData() {
  window.seasonalRolesCounter = {};
}

function isLocked() {
  return document.getElementsByTagName("body")[0].classList.contains("locked");
}

function lock() {
  document.getElementsByTagName("body")[0].classList.add("locked");
  document.getElementById("lock-icon").innerHTML = "🔒";
}

function unlock() {
  document.getElementsByTagName("body")[0].classList.remove("locked");
  document.getElementById("lock-icon").innerHTML = "";
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

function setStorageState() {
  try {
    localStorage.getItem("following");
    console.log("Katta na! GAHAHA");
    console.log("---");
    return true;
  }
  catch (AccessDeniedError) {
    warningString = "Cookies and site data permissions must be enabled " +
    "for some site features to work. This includes the ability to follow voice actors."
    setTimeout(function() { window.alert(warningString); }, 1);
    disableFollowing();
    return false;
  }
}
