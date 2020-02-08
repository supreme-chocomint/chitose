function setNavigationOnClicks() {
  let left = document.getElementById("left-nav");
  let right = document.getElementById("right-nav");
  left.onclick = function () { leftNavOnClick() };
  right.onclick = function () { rightNavOnClick() };
}

function leftNavOnClick() {

  let left = document.getElementById("left-nav");
  let right = document.getElementById("right-nav");
  let pageIndex = window.currentDisplay.vaTableBody.getAttribute("data-pageIndex");
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;

  let x = window.scrollX;
  let y = window.scrollY;
  let height = window.currentDisplay.vaTable.clientHeight;
  let yOffset = 0;

  pageIndex = parseInt(pageIndex);

  pageIndex--;
  switchToPage(pageIndex, language);
  window.currentDisplay.vaTableBody.setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == 0){ left.classList.add("inactive"); }
  right.classList.remove("inactive");  // coordinate left and right navs

  yOffset = window.currentDisplay.vaTable.clientHeight - height;
  window.scroll(x, y + yOffset); // keep same distance from bottom of page

}

function rightNavOnClick() {

  let right = document.getElementById("right-nav");
  let left = document.getElementById("left-nav");
  let tableBody = window.currentDisplay.vaTableBody;
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;

  let x = window.scrollX;
  let y = window.scrollY;
  let height = window.currentDisplay.vaTable.clientHeight;
  let yOffset = 0;

  let pageIndex = tableBody.getAttribute("data-pageIndex");
  let lastPageIndex = tableBody.getAttribute("data-pageCount");
  pageIndex = parseInt(pageIndex);
  lastPageIndex = parseInt(lastPageIndex) - 1; // because count != index

  pageIndex++;
  switchToPage(pageIndex, language);
  window.currentDisplay.vaTableBody.setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == lastPageIndex){ right.classList.add("inactive"); }
  left.classList.remove("inactive");  // coordinate left and right navs

  yOffset = window.currentDisplay.vaTable.clientHeight - height;
  window.scroll(x, y + yOffset); // keep same distance from bottom of page

}

function onSeasonChange() {
  if (window.clicked){
    VAOnClick(window.clicked);
  }
}

function onLanguageChange() {
  let vaTableBody = window.currentDisplay.vaTableBody;
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;
  resetVaTablePages(language);
  setNavigationState(vaTableBody, vaTableBody.getAttribute("data-pageSize"), language);
}

function populateVATableWithSeason(callback) {

  if (callback == null) callback = function() {}

  let quarterElement = document.getElementById("quarter-picker");
  let vaTable = window.currentDisplay.vaTable;

  let quarter = quarterElement.options[quarterElement.selectedIndex].value.toUpperCase();
  let year = document.getElementById("year-picker").value;
  let variables = {
      perPage: 50,
      page: 1,
      season: quarter,
      seasonYear: year,
  };

  clearSeasonSpecificData();
  vaTable.setAttribute("data-state", "season");
  window.currentDisplay.setVATableHeader(" VAs for " + parsedSeason(quarter, year));

  // get from cache if it exists, otherwise do request
  if (window.seasonRawData[year] && window.seasonRawData[year][quarter]) {
    for (let i = 0; i < window.mediaFormats.length; i++) {
      let data = window.seasonRawData[year][quarter][i];
      extractVAs(window.seasonalRolesCounter, window.voiceActors, data);
    }
    populateVATableWithSeasonCache();
    unlock();
    callback();
  }
  else {
    for (let format of window.mediaFormats) {
      variables.format = format;
      makeRequest(
        getQuery(""),
        variables,
        function(data) {
          // Need season to cache raw data
          collectSeasonalVAsCallback(year, quarter, data, callback);
        }
      );
    }
  }

}

function populateVATableWithSeasonCache() {
  sortedSeasonalVoiceActorIds = sortVaIdsByNumRoles(window.seasonalRolesCounter, window.voiceActors);
  fillVATableAndPage(sortedSeasonalVoiceActorIds);
}

function clearSeasonSpecificData() {
  window.seasonalRolesCounter = {};
}
