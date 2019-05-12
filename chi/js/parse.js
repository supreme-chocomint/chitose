// Misc parsing and sorting functions

// ------------ STRING HELPERS ------------ //

function parsedName(rawName) {
  let firstName = rawName.first;
  let lastName = rawName.last;
  if (rawName.first == null) {
    firstName = "";
  }
  if (rawName.last == null) {
    lastName = "";
  }
  let name = firstName + " " + lastName;
  return name.trim();
}

function parsedSeason(quarter, year) {
  return quarter.charAt(0).toUpperCase() + quarter.slice(1).toLowerCase() + " " + year;
}

// Naming sense is out the window
// Makes undefined into empty string, and adds back </p>
function fixHtmlArray(array, N) {
  for (let i = 0; i < N; i++) {
    if (array[i] == undefined) {
      array[i] = "";
    }
    else if (array[i] != ""){
      array[i] += "</p>";
    }
  }
  return array;
}

// Thank you Stack Overflow: https://stackoverflow.com/a/33369954
// Numbers, strings, and booleans return false
function isJson(item) {
  item = typeof item !== "string"
    ? JSON.stringify(item)
    : item;
  try {
      item = JSON.parse(item);
  } catch (e) {
      return false;
  }
  if (typeof item === "object" && item !== null) {
      return true;
  }
  return false;
}

// ------------ SEARCH ------------ //

function parseVASearchResults(data) {

  let staffDataArray = data.data.Page.staff;
  let voiceActorArray = [];

  for (let staffData of staffDataArray) {
    let voiceActor = {
      id: staffData.id,
      name: parsedName(staffData.name),
      url: staffData.siteUrl,
      image: staffData.image.medium
    }

    window.voiceActors[staffData.id] = voiceActor;
    voiceActorArray.push(staffData.id);

  }

  return voiceActorArray;

}

// ------------ SEASONAL ROLES ------------ //

function collectSeasonalRoles(voiceActorId, data) {

  let showDataArray = data.data.Page.media;

  for (let showData of showDataArray) {
    let charaDataArray = showData.characters.edges;
    for (let charaData of charaDataArray) {
      if (hasVoiceActor(charaData, voiceActorId)) {
        let metadata = {
          showID: showData.id,
          showName: showData.title.romaji,
          showImage: showData.coverImage,
          showUrl: showData.siteUrl,
          characterID: charaData.node.id,
          characterName: parsedName(charaData.node.name),
          characterImage: charaData.node.image,
          characterUrl: charaData.node.siteUrl
        };
        addRolesTableEntry(metadata);
      }
    }
  }

}

function hasVoiceActor(charaData, voiceActorId) {
  for (let referenceVA of getVoiceActors(charaData)) {
    if (referenceVA.id == voiceActorId) {
      return true;
    };
  };
  return false;
}

// ------------ SEASONAL VOICE ACTORS ------------ //

function extractVAs(rolesCounter, voiceActors, rawData) {

  let showDataArray = rawData.data.Page.media;

  // Get all VAs by ID and count number of roles
  for (let charaData of getAllShowCharacterDatas(showDataArray)) {
    for (let voiceActor of getVoiceActors(charaData)) {

      if (voiceActor.id in rolesCounter) {
        rolesCounter[voiceActor.id] += 1;
      }
      else {
        rolesCounter[voiceActor.id] = 1;
        voiceActors[voiceActor.id] = voiceActor;
      }

    }
  }

}

function getVoiceActors(charaData) {
  let actors = new Set();
  for (let voiceActor of charaData.voiceActors) {
    actors.add({
      name: parsedName(voiceActor.name),
      id: voiceActor.id,
      url: voiceActor.siteUrl,
      image: voiceActor.image.medium,
      language: voiceActor.language
    });
  }
  return actors;
}

function getAllShowCharacterDatas(showDataArray) {
  let combinedCharaDataArray = [];
  for (let showData of showDataArray) {
    let charaDataArray = showData.characters.edges;
    combinedCharaDataArray = combinedCharaDataArray.concat(charaDataArray);
  }
  return combinedCharaDataArray;
}

function sortVaIdsByNumRoles(rolesCounter, voiceActors) {
  // rolesCounter and voiceActors are maps

  let temp = [];
  let result = [];

  for (let id of Object.keys(rolesCounter)) {
    temp.push({id: id, numRoles: rolesCounter[id]});
  }

  temp.sort(function(a, b) {
    return b.numRoles - a.numRoles; // sort in descending order
  })

  for (let k of temp) {
    result.push(k.id);
  }

  return result;

}

// ------------ VOICE ACTOR DETAILS ------------ //

function collectVADetails(data) {

  let staff = data.data.Staff;

  let details = {
    roles: [],
    id: staff.id,
    name: parsedName(staff.name),
    language: staff.language,
    url: staff.siteUrl,
    image: staff.image.large,
    popularity: staff.favourites,
    numCorruptRoles: 0
  };

  window.voiceActors[details.id] = details;

  extractVARoles(data);

}

function extractVARoles(vaDataPage) {

  let staff = vaDataPage.data.Staff;
  let charaEdges = staff.characters.edges;
  let charaNodes = staff.characters.nodes;

  let vaInfoContainer = document.getElementById("va-info-container");
  let doneCharacter = false;
  let corruptRolesCount = 0;

  for (let charaNode of charaNodes) {

    for (let id of getMediaEdgeIds(charaNode)) {
      for (let charaEdge of charaEdges) {
        if (charaEdge.id == id) {
          let show = getMainShowofCharacter(charaEdge);
          let character = {
            id: charaNode.id,
            favourites: charaNode.favourites,
            name: parsedName(charaNode.name),
            url: charaNode.siteUrl,
            image: charaNode.image.large,
            characterRole: charaEdge.role
          }
          window.voiceActors[staff.id].roles.push({show: show, character: character});
          doneCharacter = true;
          break;  // optimization
        }
      }
      if (doneCharacter) {
        break; // optimization
      }
    }

    // detect AniList character data inconsistency
    if (!doneCharacter) {
      let variables = {
        id: charaNode.id
      };
      makeRequest(
        getQuery("CHARACTER ID"),
        variables,
        function(characterData) {
          addAniListCorruptRoles(vaDataPage, characterData);
        }
      );
      corruptRolesCount++;
    }
    doneCharacter = false;

  }

  vaInfoContainer.setAttribute("data-va-corrupt-roles", corruptRolesCount);

  if (corruptRolesCount == 0) {
    decideNextStep(vaDataPage);
  } else {
    // callbacks will decide next step
    console.log("Attempted to fix corrupt roles: " + corruptRolesCount);
  }

}

// Assumes most popular entry = main entry
function getMainShowofCharacter(charaEdge) {

  let maxPopularity = 0;
  let mainShow = charaEdge.media[0];

  for (let show of charaEdge.media) {
    if (show.popularity > maxPopularity) {
      maxPopularity = show.popularity;
      mainShow = show;
    }
  }

  return mainShow;

}

function getMediaEdgeIds(charaNode) {
  let ids = [];
  for (let obj of charaNode.media.edges) {
    ids.push(obj.id);
  }
  return ids;
}

function addAniListCorruptRoles(vaDataPage, data) {

  let vaInfoContainer = document.getElementById("va-info-container");
  let toFixCount = vaInfoContainer.getAttribute("data-va-corrupt-roles");
  let charaNode = data.data.Character;
  let character, show, role;

  try {

    character = {
      characterRole: charaNode.media.edges[0].characterRole, // the problem data
      id: charaNode.id,
      favourites: charaNode.favourites,
      name: parsedName(charaNode.name),
      url: charaNode.siteUrl,
      image: charaNode.image.large
    }

    show = charaNode.media.nodes[0];
    role = {show: show, character: character};
    window.voiceActors[vaDataPage.data.Staff.id].roles.push(role);

  } catch (IsolatedEdgeException) {
    console.log("Character data for " + charaNode.id +
                "/" + parsedName(charaNode.name) + " unrecoverable.");
    window.voiceActors[vaDataPage.data.Staff.id].numCorruptRoles += 1;
  }

  toFixCount--;
  vaInfoContainer.setAttribute("data-va-corrupt-roles", toFixCount);

  if (toFixCount == 0) {
    decideNextStep(vaDataPage);
  }

}

function requestNextVaPage(data) {

  let staff = data.data.Staff;
  let nextPage = staff.characters.pageInfo.currentPage + 1;
  let lastPage = staff.characters.pageInfo.lastPage;
  let variables = {
    id: staff.id,
    pageNum: nextPage
  }

  makeRequest(
    getQuery("VA ID"),
    variables,
    function(newData) {
      addOldEdges(data, newData)
    }
  );

  displayPageProgress(nextPage, lastPage);

}

function addOldEdges(existingData, newData) {

  existingEdges = existingData.data.Staff.characters.edges;
  newEdges = newData.data.Staff.characters.edges;
  newData.data.Staff.characters.edges = existingEdges.concat(newEdges);

  extractVARoles(newData);

}

function decideNextStep(vaDataPage) {

  // weeeeeeeeeee
  if (vaDataPage.data.Staff.characters.pageInfo.currentPage == 1) {
    if (vaDataPage.data.Staff.characters.nodes.length != 0) {
      fillVaBasicInfo(window.voiceActors[vaDataPage.data.Staff.id]);
    }
    else { // Not a voice actor
      unlock();
      addNotVaIndicator();
      return;
    }
  }

  if (vaDataPage.data.Staff.characters.pageInfo.hasNextPage) {
    requestNextVaPage(vaDataPage);
  } else {
    fillVaAdvancedInfo(window.voiceActors[vaDataPage.data.Staff.id]);
    unlock();
  }

}

function calculateStatistics(id) {

  let va = window.voiceActors[id];
  va.rolesCount = va.roles.length;
  va.roleMostPopularShow = getRoleByHighestShowMetric("popularity", va.roles);
  va.roleHighestRatedShow = getRoleByHighestShowMetric("meanScore", va.roles);
  va.avgCharacterPopularity = getAvgCharacterPopularity(va);
  va.characterSpread = getCharacterSignificanceSpread(va.roles);

}

function getRoleByHighestShowMetric(metric, roles) {
  let max = 0;
  let highest = roles[0];
  for (let role of roles) {
    if (role.show[metric] > max) {
      max = role.show[metric];
      highest = role;
    }
  }
  return highest;
}

function getAvgCharacterPopularity(va) {

  if (va.characterSpread == null) {
    va.characterSpread = getCharacterSignificanceSpread(va.roles);
  }

  // if zero, not a voice actor
  if (va.characterSpread.MAIN == va.characterSpread.MAIN == 0) {
    return {main: 0, total: 0};
  }

  let total = 0;
  let main = 0;

  for (let role of va.roles) {
    if (role.character.characterRole == "MAIN") {
      main += role.character.favourites;
    }
    total += role.character.favourites;
  }

  return {
    main: Math.round(main / va.characterSpread.MAIN),
    total: Math.round(total / va.rolesCount)
  };

}

function getCharacterSignificanceSpread(roles) {

  let main = 0;
  let supporting = 0;

  for (let role of roles) {
    if (role.character.characterRole == "MAIN") { main += 1; }
    else { supporting += 1; }
  }

  return {MAIN: main, SUPPORTING: supporting};

}

function addUwCharacters(va, numRoles) {

  let roles = va.roles.slice(); // copy
  sortRolesByShowPopularity(roles);
  roles.reverse();  // low to high popularity

  roles = roles.filter(function(role) {
    if (role.character.favourites <= 10) {
      return false; // gauge prominance
    }
    if (role.show.popularity >= 30000) {
      return false;
    }
    if ( va.roles.slice(0, numRoles).includes(role) ) {
      return false;
    }
    return true;
  });

  let candidates;
  let thresholdScores = [80, 77, 75, 72, 70];
  let index = 0;

  // get roles by ascending show popularity that meet score threshold
  while (index != thresholdScores.length){
    candidates = roles.filter(role => role.show.meanScore >= thresholdScores[index]);
    if (candidates.length >= numRoles) {
      break;
    }
    index++;
  }

  va.uwRoles = candidates.slice(0, numRoles);
  sortRolesByShowRating(va.uwRoles);

}

function sortRolesByFavourites(roles) {
  roles.sort(function(a, b) {
    return b.character.favourites - a.character.favourites; // sort in descending order
  })
}

function sortRolesByShowPopularity(roles) {
  roles.sort(function(a, b) {
    return b.show.popularity - a.show.popularity; // sort in descending order
  })
}

function sortRolesByShowRating(roles) {
  roles.sort(function(a, b) {
    return b.show.meanScore - a.show.meanScore; // sort in descending order
  })
}
