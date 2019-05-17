function clearSearchBar() {
  document.getElementById("search-bar").value = "";
}

function searchButtonOnClick() {

  let searchTerm = document.getElementById("search-bar").value;
  let searchCode = document.getElementById("search-picker").value;
  let callback;
  let variables = {
      perPage: 50,
      page: 1,
      search: searchTerm
  };

  if (!isLocked()) {

    if (searchTerm == "") {
      return;
    }

    lock();
    clearSeasonSpecificData();
    clearVATable();
    setVATableState("search");
    document.getElementById("tool-help").innerHTML = "";

    window.currentDisplay.setVATableHeader(" search '" + searchTerm + "'");

    switch (searchCode) {
      case "VA SEARCH":
        callback = collectVASearchResultsCallback;
        break;

      case "ANIME SEARCH":
        callback = collectAnimeSearchResultsCallback;
        break;

      case "CHARACTER SEARCH":
        let character = extractCharacter(searchTerm);
        let anime = extractAnime(searchTerm);
        if (anime) {
          variables.search = anime;
          makeRequest(
            getQuery("ANIME SEARCH"),
            variables,
            function(data) {
              let isCompoundSearch = true;
              collectCharacterSearchResultsCallback(data, isCompoundSearch);
            }
          );
        }
        callback = collectCharacterSearchResultsCallback;
        variables.search = character;
        break;

      default:
        console.log("Search code unknown; aborting. (This shouldn't ever happen).");
        return;
    }

    makeRequest(
      getQuery(searchCode),
      variables,
      callback
    );

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
        image: staffData.image.large,
        language: staffData.language
      }
      if (!(staffData.id in window.voiceActors)) {
        window.voiceActors[staffData.id] = voiceActor;
      }
      voiceActorArray.push(staffData.id);
    }
  }

  return voiceActorArray;

}

function collectAnimeSearchResultsCallback(data) {
  let mediaArray = data.data.Page.media;
  fillMediaSearchTable(mediaArray);  // filling VA table for ease
  unlock();
}

function collectCharacterSearchResultsCallback(data, isCompoundSearch) {
  console.log(data, isCompoundSearch);
  unlock();
}

function extractCharacter(searchTerm) {
  return searchTerm.split(",")[0].split(" from ")[0].trim();
}

function extractAnime(searchTerm) {
  let a = searchTerm.split(",").slice(-1)[0];
  if (!(a == undefined)) {
    a = searchTerm.split(" from ").slice(-1)[0];
  }
  return a.trim();
}
