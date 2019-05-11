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
      image: voiceActor.image.medium
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

  let blurb = fixHtmlArray(staff.description.split("</p>").slice(0, 2), 2);
  let details = {
    roles: [], // roles will be sorted by favourites due to query
    id: staff.id,
    name: parsedName(staff.name),
    descriptionHTML: blurb[0] + blurb[1],
    language: staff.language,
    url: staff.siteUrl,
    image: staff.image.large
  };

  window.voiceActors[details.id] = details;
  fillVaBasicInfo(details);
  decideVARequest(data);

}

function decideVARequest(data) {

  let staff = data.data.Staff;

  if (staff.characters.pageInfo.hasNextPage) {
    let nextPage = parseInt(staff.characters.pageInfo.currentPage) + 1;
    let variables = {
      id: staff.id,
      pageNum: nextPage
    }
    makeRequest(
      getQuery("VA ID"),
      variables,
      function(newData) {
        combineVAPages(data, newData)
      }
    );
    console.log("Requested page " + nextPage);
  }

  else {
    extractVARoles(data);
  }

}

function combineVAPages(existingData, newData) {

  existingEdges = existingData.data.Staff.characters.edges;
  existingNodes = existingData.data.Staff.characters.nodes;

  newEdges = newData.data.Staff.characters.edges;
  newNodes = newData.data.Staff.characters.nodes;
  newPageInfo = newData.data.Staff.characters.pageInfo;

  // Concat to existing to keep queried ordering of characters
  existingData.data.Staff.characters.edges = existingEdges.concat(newEdges);
  existingData.data.Staff.characters.nodes = existingNodes.concat(newNodes);
  existingData.data.Staff.characters.pageInfo = newPageInfo;
  decideVARequest(existingData);

}

function extractVARoles(data) {

  let staff = data.data.Staff;
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
            image: charaNode.image.medium
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
        function(data) {
          addAniListCorruptRoles(staff.id, data);
        }
      );
      corruptRolesCount++;
    }
    doneCharacter = false;

  }

  vaInfoContainer.setAttribute("data-va-corrupt-roles", corruptRolesCount);
  if (corruptRolesCount == 0) {
    fillVaAdvancedInfo(details);
  } else {
    console.log("Corrupt roles: " + corruptRolesCount);
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

function addAniListCorruptRoles(vaId, data) {

  let vaInfoContainer = document.getElementById("va-info-container");
  let corruptRolesCount = vaInfoContainer.getAttribute("data-va-corrupt-roles");
  let charaNode = data.data.Character;

  let character = {
    id: charaNode.id,
    favourites: charaNode.favourites,
    name: parsedName(charaNode.name),
    url: charaNode.siteUrl,
    image: charaNode.image.medium
  }
  let show = charaNode.media.nodes[0];
  let role = {show: show, character: character};

  window.voiceActors[vaId].roles.push(role);

  corruptRolesCount--;
  vaInfoContainer.setAttribute("data-va-corrupt-roles", corruptRolesCount);
  if (corruptRolesCount == 0) {
    fillVaAdvancedInfo(window.voiceActors[vaId]);
  }

}
