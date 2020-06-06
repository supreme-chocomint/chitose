function clearSearchBar() {
  document.getElementById("search-bar").value = "";
}

function searchButtonOnClick() {

  let searchBar = document.getElementById("search-bar");
  let searchTerm = searchBar.value;
  let searchCode = document.getElementById("search-picker").value;
  let callback;
  let isCompoundSearch = false;
  let followUp;
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
        variables.search = character;
        if (anime) {
          isCompoundSearch = true;
          searchBar.setAttribute("data-async-count", 0);
          variables.search = anime;
          makeRequest(
            getQuery("ANIME SEARCH CHARACTER ID"),
            variables,
            collectCharacterIdsHelperCallback
          );
          callback = function (data) {
            collectCompoundSearchResultsCallback(data, variables);
          };
          variables.search = character; // restore
        }
        else {
          callback = collectCharacterSearchResultsCallback;
        }
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
    window.cachedQueryVariables = variables;

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
function collectMediaRoles(media, page = 1, data) {

  let variables = {
    id: media.id,
    page: page,
    perPage: 25,
  };

  // If starting collection
  if (!data) {
    data = { Media: media };
    data.Media.characters = { edges: [] };
    lock();
  }

  makeRequest(
    getQuery("CHARACTERS BY ANIME ID"),
    variables,
    function (pageOfData) {
      const newCharacters = pageOfData.data.Media.characters.edges;
      if (newCharacters.length != 0) {
        data.Media.characters.edges = data.Media.characters.edges.concat(newCharacters);
        collectMediaRoles(media, page + 1, data)
      }
      else {
        fillCharacterBrowseTable(data);
        unlock();
      }

    }
  );

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
  edge.voiceActors.sort(function (a, b) {
    return a.language > b.language;
  })
  let onclick = function () {
    unclick();
    fillVALanguageTable(name, edge.voiceActors);
  }
  addVasToGlobalHash(edge.voiceActors);
  return { role: role, onclick: onclick };
}

function collectCharacterSearchResultsCallback(data) {

  let notAdult = function (media) { return !(media.node.isAdult) };
  let characterArray = data.data.Page.characters.filter(c => c.media.edges.some(notAdult));
  fillCharacterSearchTable(characterArray);
  unlock();

}

function collectCompoundSearchResultsCallback(data, append) {

  let searchBar = document.getElementById("search-bar");
  let async = parseInt(searchBar.getAttribute("data-async-count"));

  async++;
  searchBar.setAttribute("data-async-count", async);
  if (async >= 2) {
    filterCharacterSearchById(data, window.cachedCharacterIds);
  }
  else { // let helper handle it
    window.cachedResponse = data;
    return;
  }

  let notAdult = function (media) { return !(media.node.isAdult) };
  let characterArray = data.data.Page.characters.filter(c => c.media.edges.some(notAdult));

  // only fill if done or have something to fill
  if (!(data.data.Page.pageInfo.hasNextPage)) {
    fillCharacterSearchTable(characterArray, append);
  }
  else if (characterArray.length != 0) {
    fillCharacterSearchTable(characterArray, append);
  }

  if (data.data.Page.pageInfo.hasNextPage) {
    window.cachedQueryVariables.page = parseInt(window.cachedQueryVariables.page) + 1;
    let callback = function (data) {
      let appendResults = true;
      collectCompoundSearchResultsCallback(data, appendResults);
    };
    makeRequest(getQuery("CHARACTER SEARCH"), window.cachedQueryVariables, callback);
    return;
  }

  unlock();

}

function filterCharacterSearchById(response, characterIds) {
  let characters = response.data.Page.characters;
  response.data.Page.characters = characters.filter(c => characterIds[c.id]);
}

function collectCharacterIdsHelperCallback(data) {

  let searchBar = document.getElementById("search-bar");
  let async = searchBar.getAttribute("data-async-count");
  async++;
  searchBar.setAttribute("data-async-count", async);

  let media = data.data.Page.media;
  window.cachedCharacterIds = {};
  for (let m of media) {
    for (let c of m.characters.edges) {
      window.cachedCharacterIds[c.node.id] = true;
    }
  }

  if (async == 2) {
    collectCompoundSearchResultsCallback(window.cachedResponse);
  }

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

  let edgesByEntryPopularity = character.media.edges.sort(function (a, b) {
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
  role.character.nameEmbellish = `from ${character.media.edges[0].node.title.romaji}`;

  let sortedVoiceActors = voiceActorsArray.sort(function (a, b) {
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
      } else {
        return 1;
      }
    }
  })

  let onclick = function () {
    unclick();
    let hasMediaEntries = true;
    fillVALanguageTable(name, sortedVoiceActors, hasMediaEntries);
  }

  addVasToGlobalHash(sortedVoiceActors);

  return { role: role, onclick: onclick };

}

function extractCharacter(searchTerm) {
  return searchTerm.split(",")[0].split(" from ")[0].trim();
}

function extractAnime(searchTerm) {
  let a = searchTerm.split(",").slice(-1)[0];
  a = a.split(" from ").slice(-1)[0];
  return (searchTerm == a) ? null : a.trim();
}

function addVasToGlobalHash(rawVoiceActors) {
  for (let rawVa of rawVoiceActors) {
    let va = {
      id: rawVa.id,
      image: rawVa.image.large,
      language: rawVa.language,
      name: parsedName(rawVa.name),
      url: rawVa.siteUrl
    }
    if (window.voiceActors[va.id] == undefined) {
      // add if doesn't exist
      window.voiceActors[va.id] = va;
    }
  }
}
