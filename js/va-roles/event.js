function VAOnClick(voiceActorId) {

  let rolesTable =  window.currentDisplay.rolesTable;
  let rolesTableBody =  window.currentDisplay.rolesTableBody;
  let seasonElement = document.getElementById("quarter-picker");
  let season = seasonElement.options[seasonElement.selectedIndex].value.toUpperCase();
  let year = parseInt(document.getElementById("year-picker").value);  // picker values are strings

  let variables = {
      perPage: 50,
      page: 1,
      season: season,
      seasonYear: year,
  };

  if (!isLocked()) {

    rolesTable.scrollIntoViewIfNeeded();

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

function unclick() {

  window.currentDisplay.setRolesTableHeader("");
  window.clicked = "";

}

function click(vaId) {

  let name = window.voiceActors[vaId].name;
  let quarter = document.getElementById("quarter-picker").value;
  let year = document.getElementById("year-picker").value;

  window.currentDisplay.setRolesTableHeader(" " + name + " for " + parsedSeason(quarter, year));
  window.clicked = vaId;

}
