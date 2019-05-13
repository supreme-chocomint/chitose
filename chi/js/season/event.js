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

function clearSeasonSpecificData() {
  window.seasonalRolesCounter = {};
}
