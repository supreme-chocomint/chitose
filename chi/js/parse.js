// Misc parsing and sorting functions

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

function hasVoiceActor(charaData, voiceActorId) {
  for (let referenceVA of getVoiceActors(charaData)) {
    if (referenceVA.id == voiceActorId) {
      return true;
    };
  };
  return false;
}

function getVoiceActors(charaData) {
  let actors = new Set();
  for (let voiceActor of charaData.voiceActors) {
    actors.add({
      name: parsedName(voiceActor.name),
      id: voiceActor.id,
      url: voiceActor.siteUrl
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

function collectVASearchResults(data) {

  let staffDataArray = data.data.Page.staff;

  for (let staffData of staffDataArray) {
    hasResult = true;
    let metadata = {
      name: parsedName(staffData.name),
      url: staffData.siteUrl,
      id: staffData.id
    };
    addVATableEntry(metadata);
  }

  if (staffDataArray.length == 0) {
    addNoResultsIndicator("va-table-body");
  }

}

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

function extractVAs(voiceActors, rawData) {

  let showDataArray = rawData.data.Page.media;

  // Get all VAs by ID and count number of roles
  for (let charaData of getAllShowCharacterDatas(showDataArray)) {
    for (let voiceActor of getVoiceActors(charaData)) {
      if (voiceActor.id in voiceActors) {
        voiceActors[voiceActor.id].numRoles += 1;
      }
      else {
        voiceActors[voiceActor.id] = {
          numRoles: 1,
          name: voiceActor.name,
          url: voiceActor.url
        };
      }
    }
  }

  return voiceActors;

}

function sortVAsByNumRoles(voiceActors) {

  let sortedVoiceActors = [];

  // transform objects into arrays for ease's sake
  for (let voiceActor in voiceActors) {
    sortedVoiceActors.push([
      voiceActor,
      voiceActors[voiceActor].name,
      voiceActors[voiceActor].numRoles,
      voiceActors[voiceActor].url
    ]);
  }

  sortedVoiceActors.sort(function(a, b) {
    return b[2] - a[2]; // sort in descending order
  });

  window.sortedVoiceActors = sortedVoiceActors;  // globally cache result
  return sortedVoiceActors;

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
