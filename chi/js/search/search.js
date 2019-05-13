function clearSearchBar() {
  document.getElementById("search-bar").value = "";
}

function searchButtonOnClick() {

  let searchTerm = document.getElementById("search-bar").value;
  let variables = {
      perPage: 50,
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

function collectVASearchResultsCallback(data) {
  let voiceActorArray = parseVASearchResults(data);
  fillVATableAndPage(voiceActorArray);
  unlock();
}

function parseVASearchResults(data) {

  let staffDataArray = data.data.Page.staff;
  let voiceActorArray = [];

  for (let staffData of staffDataArray) {
    if (staffData.characters.nodes.length != 0) {
      let voiceActor = {
        id: staffData.id,
        name: parsedName(staffData.name),
        url: staffData.siteUrl,
        image: staffData.image.medium,
        language: staffData.language
      }
      window.voiceActors[staffData.id] = voiceActor;
      voiceActorArray.push(staffData.id);
    }
  }

  return voiceActorArray;

}
