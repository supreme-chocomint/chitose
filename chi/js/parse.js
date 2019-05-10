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

function parsedSeason(quarter, year) {
  return quarter.charAt(0).toUpperCase() + quarter.slice(1).toLowerCase() + " " + year;
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
        voiceActors[voiceActor.id] = {
          id: voiceActor.id,  // redundant, for convenience in click-related actions
          name: voiceActor.name,
          url: voiceActor.url,
          image: voiceActor.image
        };
      }

    }
  }

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
