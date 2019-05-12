// Functions that respond to user clicks

function setNavigationOnClicks() {
  let left = document.getElementById("left-nav");
  let right = document.getElementById("right-nav");
  left.onclick = function () { leftNavOnClick() };
  right.onclick = function () { rightNavOnClick() };
}

function searchButtonOnClick() {

  let searchTerm = document.getElementById("search-bar").value;
  let variables = {
      perPage: 30,
      page: 1,
      search: searchTerm
  };

  if (!isLocked()) {

    if (searchTerm != "") {

      lock();
      clearSeasonSpecificData();
      clearVATable();
      setVATableState("search");

      let vaTableCaption = document.getElementById("va-table-caption");
      vaTableCaption.setAttribute("data-content", " search '" + searchTerm + "'");

      makeRequest(
        getQuery("VA SEARCH"),
        variables,
        collectVASearchResultsCallback
      );

    }

  }
}

function onSeasonChange() {
  if (window.clicked){
    VAOnClick(window.clicked);
  }
}

function onLanguageChange() {

  let vaTableBody = document.getElementById("va-table-body");
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;
  resetVaTablePages(language);
  setNavigationState(vaTableBody, vaTableBody.getAttribute("data-pageSize"), language);

}

function VAOnClick(voiceActorId) {

  let rolesTableBody = document.getElementById("roles-table-body");
  let seasonElement = document.getElementById("quarter-picker");
  let season = seasonElement.options[seasonElement.selectedIndex].value.toUpperCase();
  let year = document.getElementById("year-picker").value;

  let variables = {
      perPage: 50,
      page: 1,
      season: season,
      seasonYear: year,
  };

  if (!isLocked()) {

    lock();
    clearRolesTable();
    unclick();
    click(voiceActorId);

    // get from cache if it exists, otherwise do request
    if (window.seasonRawData[year] && window.seasonRawData[year][season]) {
      for (let i = 0; i < window.mediaFormats.length; i++) {
        collectSeasonalRoles(voiceActorId, window.seasonRawData[year][season][i]);
      }
      if (rolesTableBody.innerHTML == "") {
        addNoResultsIndicator("roles-table-body");
      }
      unlock();
    }
    else {
      for (let format of window.mediaFormats) {
        variables.format = format;
        makeRequest(
          getQuery(""),
          variables,
          function(data) { // callback requires additional argument: the ID
            collectSeasonalRolesCallback(voiceActorId, year, season, data)
          }
        );
      }
    }

  }
}

function VADetailsOnClick(voiceActorId) {

  let mainContainer = document.getElementById("main-container");
  let vaInfoContainer = document.getElementById("va-info-container");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");
  let workingId = vaInfoContainer.getAttribute("data-working");

  let variables = {
    id: voiceActorId,
    pageNum: 1
  }

  if (isLocked()) {

    if (workingId == voiceActorId) {
      mainContainer.style.display = "none";
      vaInfoContainer.style.display = "";
    }

    else if (workingId != undefined && workingId != 0){  // purely defensive check
      window.alert(
        `Currently busy fetching data for ${window.voiceActors[workingId].name}.
        View their details page to see progress.`
      );
    }

  }
  else {

    lock(voiceActorId);
    mainContainer.style.display = "none";
    vaInfoContainer.style.display = "";
    clearVaInfo();
    let roles = window.voiceActors[voiceActorId].roles;

    // use cache if it exists, otherwise request data
    if (roles && roles.length != 0) {
      fillVaBasicInfo(window.voiceActors[voiceActorId]);
      fillVaAdvancedInfo(window.voiceActors[voiceActorId]);
      unlock();
    }
    else {
      document.getElementById("va-info-bio-text").innerHTML = "Getting initial data...";
      makeRequest(getQuery("VA ID"), variables, collectVADetails);
    }

  }

}

function returnButtonOnClick() {

  let mainContainer = document.getElementById("main-container");
  let vaInfoContainer = document.getElementById("va-info-container");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");

  mainContainer.style.display = "";
  vaInfoContainer.style.display = "none";

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

function darkModeSwitchOnClick() {
  let body = document.getElementsByTagName("body")[0];
  let _switch = document.getElementById("dark-mode-switch");
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    _switch.value = "Turn Dark Mode On";
    saveTheme("light");
  }
  else {
    body.classList.add("dark");
    _switch.value = "Turn Dark Mode Off";
    saveTheme("dark");
  }
}

function leftTableSwitchOnClick() {

  let vaTable = document.getElementById("va-table");
  let followTable = document.getElementById("follow-table");
  let followTableBody = document.getElementById("follow-table-body");

  let searchBar = document.getElementById("search-bar");
  let searchButton = document.getElementById("search-button");
  let refreshButton = document.getElementById("refresh-button");

  let navDiv = document.getElementById("navigation");
  let tranferDiv = document.getElementById("transfer");

  // switch to VAs
  if (vaTable.style.display == "none") {

    // make sure follow states are up-to-date
    // because refetching everything > writing a new function
    changed = followTableBody.getAttribute("data-changed");
    if (changed == "true") {
      clearVATable();
      populateVATableWithSeason();
      followTableBody.setAttribute("data-changed", "false");
    }

    // there's probably a better way to turn these all off
    vaTable.style.display = "";
    followTable.style.display = "none";
    searchBar.disabled = false;
    searchButton.disabled = false;
    refreshButton.classList.remove("disabled");
    navDiv.style.display = "";
    tranferDiv.style.display = "none";

  }
  // switch to follows
  else {
    vaTable.style.display = "none";
    followTable.style.display = "";
    searchBar.disabled = true;
    searchButton.disabled = true;
    refreshButton.classList.add("disabled");
    navDiv.style.display = "none";
    tranferDiv.style.display = "";
  }

}

function leftNavOnClick() {

  let left = document.getElementById("left-nav");
  let right = document.getElementById("right-nav");
  let pageIndex = document.getElementById("va-table-body").getAttribute("data-pageIndex");
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;
  pageIndex = parseInt(pageIndex);

  pageIndex--;
  switchToPage(pageIndex, language);
  document.getElementById("va-table-body").setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == 0){ left.classList.add("inactive"); }
  right.classList.remove("inactive");  // coordinate left and right navs

}

function rightNavOnClick() {

  let right = document.getElementById("right-nav");
  let left = document.getElementById("left-nav");
  let tableBody = document.getElementById("va-table-body");
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;

  let pageIndex = tableBody.getAttribute("data-pageIndex");
  let lastPageIndex = tableBody.getAttribute("data-pageCount");
  pageIndex = parseInt(pageIndex);
  lastPageIndex = parseInt(lastPageIndex) - 1; // because count != index

  pageIndex++;
  switchToPage(pageIndex, language);
  document.getElementById("va-table-body").setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == lastPageIndex){ right.classList.add("inactive"); }
  left.classList.remove("inactive");  // coordinate left and right navs

}

function importButtonOnClick() {

  let newFollows = document.getElementById("transfer-box").value;
  let followTableBody = document.getElementById("follow-table-body");
  let doImport = window.confirm("Importing will replace all existing follows. Are you sure?");

  if (doImport) {
    if (isJson(newFollows)) {
      localStorage.setItem("following", newFollows);
      followTableBody.innerHTML = "";
      populateFollowTable();
      followTableBody.setAttribute("data-changed", true);
    }
    else {
      window.alert("Import data invalid. No changes made to existing follows.");
    }
  }
}

function exportButtonOnClick() {
  let transferBox = document.getElementById("transfer-box");
  transferBox.value = JSON.stringify(getFollowing());
}

function unclick() {

  let rolesTableCaption = document.getElementById("roles-table-caption");
  rolesTableCaption.setAttribute("data-content", "");
  window.clicked = "";

}

function click(vaId) {

  let name = window.voiceActors[vaId].name;
  let rolesTableCaption = document.getElementById("roles-table-caption");
  let quarter = document.getElementById("quarter-picker").value;
  let year = document.getElementById("year-picker").value;

  rolesTableCaption.setAttribute("data-content", " " + name + " for " + parsedSeason(quarter, year));
  window.clicked = vaId;

}
