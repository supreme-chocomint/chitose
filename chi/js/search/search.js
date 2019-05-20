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
  let mediaArray = data.data.Page.media.filter(m => (m.isAdult == false));
  fillMediaSearchTable(mediaArray);
  unlock();
}

// Onclick for elements created by collectAnimeSearchResultsCallback()
// Gets VAs and characters from media id
function collectMediaRoles(media) {
  let data = {Media: media};
  fillCharacterBrowseTable(data);
}

function parseCharacterBrowseData(edge) {
  let name = parsedName(edge.node.name);
  let role = {
    character: {
      image: edge.node.image.large,
      url: edge.node.siteUrl,
      name: name
    }
  }
  edge.voiceActors.sort(function(a, b) {
    return a.language > b.language;
  })
  let onclick = function() {
    unclick();
    fillVALanguageTable(name, edge.voiceActors);
  }
  return {role: role, onclick: onclick};
}

function collectCharacterSearchResultsCallback(data, isCompoundSearch) {
  let notAdult = function(media) { return !(media.node.isAdult) };
  let characterArray = data.data.Page.characters.filter(c => c.media.edges.some(notAdult));
  fillCharacterSearchTable(characterArray);
  unlock();
}

function parseCharacterSearchData(character) {

  let voiceActors = {};
  let voiceActorsArray = [];
  let isAnimated = false;
  let name = parsedName(character.name);
  let role = {
    character: {
      image: character.image.large,
      url: character.siteUrl,
      name: name
    }
  }

  let edgesByEntryPopularity = character.media.edges.sort(function(a, b) {
    return b.node.popularity - a.node.popularity;  // sort descending
  });

  for (let edge of edgesByEntryPopularity) {
    let entry = edge.node;
    if (entry.type != "ANIME") {
      continue;
    }
    isAnimated = true;
    let voiceActorData = edge.voiceActors;
    for (let data of voiceActorData) {
      let voiceActorObj = data;
      voiceActorObj.media = [entry];
      if (voiceActors[data.id] == undefined) {
        // keep first encountered (most popular first)
        voiceActors[data.id] = voiceActorObj;
      }
      else {
        voiceActors[data.id].media.push(entry);
      }
    }
  }

  if (!isAnimated) {
    return null;
  }

  voiceActorsArray = Object.values(voiceActors);
  role.character.nameEmbellish = `from ${voiceActorsArray[0].media[0].title.romaji}`;

  let sortedVoiceActors = voiceActorsArray.sort(function(a, b) {
    // sort by language, then media popularity
    if (a.language == b.language) {
      if (a.media[0].popularity > b.media[0].popularity) {
        return -1;  // more popular first
      } else {
        return 1;
      }
    }
    else {
      if (a.language < b.language) {
        return -1;  // alphabetical
      };
    }
  })

  let onclick = function() {
    unclick();
    let hasMediaEntries = true;
    fillVALanguageTable(name, sortedVoiceActors, hasMediaEntries);
  }

  return {role: role, onclick: onclick};

}

function extractCharacter(searchTerm) {
  return searchTerm.split(",")[0].split(" from ")[0].trim();
}

function extractAnime(searchTerm) {
  let a = searchTerm.split(",").slice(-1)[0];
  if (!(a == undefined)) {
    a = searchTerm.split(" from ").slice(-1)[0];
  }
  return (searchTerm == a) ? null : a.trim();
}
