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
      perPage: 5,
      page: 1,
      search: searchTerm
  };

  if (!isLocked()) {

    lock();
    clearVATable();
    clearRolesTable();

    if (searchTerm == "") {
      fillVATableAndPage(window.sortedVoiceActors);
      unlock();
    }
    else {
      makeRequest(
        getQuery("VA SEARCH"),
        variables,
        collectVASearchResultsCallback
      );
    }

  }
}

function VAOnClick(voiceActorId) {

  let vaTable = document.getElementById("va-table-body");
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

    for (let format of window.mediaFormats) {

      variables.format = format;
      makeRequest(
        getQuery(""),
        variables,
        function(data) { // callback requires additional argument: the ID
          collectSeasonalRolesCallback(voiceActorId, data)
        }
      );

    }
  }
}

function refreshButtonOnClick() {
  if (!isLocked()) {
    lock();
    document.getElementById("search-bar").value = "";
    clearVATable();
    clearRolesTable();
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
  let refreshButton = document.getElementById("refresh-button");
  let leftNav = document.getElementById("left-nav");
  let rightNav = document.getElementById("right-nav");
  let tranferDiv = document.getElementById("transfer");
  let searchBar = document.getElementById("search-bar");
  let searchButton = document.getElementById("search-button");
  let pageTracker = document.getElementById("page-tracker");

  // switch to VAs
  if (vaTable.style.display == "none") {

    // make sure follow states are up-to-date
    // because refetching everything > writing a new function
    changed = followTableBody.getAttribute("data-changed");
    if (changed == "true") {
      refreshButtonOnClick();
      followTableBody.setAttribute("data-changed", "false");
    }

    // there's probably a better way to turn these all off
    vaTable.style.display = "";
    followTable.style.display = "none";
    refreshButton.classList.remove("disabled");
    leftNav.classList.remove("disabled");
    rightNav.classList.remove("disabled"); //
    transfer.style.display = "none";
    searchBar.disabled = false;
    searchButton.disabled = false;
    pageTracker.classList.remove("disabled");

  }
  // switch to follows
  else {
    vaTable.style.display = "none";
    followTable.style.display = "";
    refreshButton.classList.add("disabled");
    leftNav.classList.add("disabled");
    rightNav.classList.add("disabled");
    transfer.style.display = "";
    searchBar.disabled = true;
    searchButton.disabled = true;
    pageTracker.classList.add("disabled");
  }

}

function leftNavOnClick() {

  let left = document.getElementById("left-nav");
  let right = document.getElementById("right-nav");
  let pageIndex = document.getElementById("va-table-body").getAttribute("data-pageIndex");
  pageIndex = parseInt(pageIndex);

  pageIndex--;
  switchToPage(pageIndex);
  document.getElementById("va-table-body").setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == 0){ left.classList.add("inactive"); }
  right.classList.remove("inactive");  // coordinate left and right navs

}

function rightNavOnClick() {

  let right = document.getElementById("right-nav");
  let left = document.getElementById("left-nav");
  let tableBody = document.getElementById("va-table-body")

  let pageIndex = tableBody.getAttribute("data-pageIndex");
  let lastPageIndex = tableBody.getAttribute("data-pageCount");
  pageIndex = parseInt(pageIndex);
  lastPageIndex = parseInt(lastPageIndex) - 1; // because count != index

  pageIndex++;
  switchToPage(pageIndex);
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
