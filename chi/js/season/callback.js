function collectSeasonalVAsCallback(year, quarter, data) {

  let vaTableBody = window.currentDisplay.vaTableBody;
  let asyncCount = vaTableBody.getAttribute("data-async-count");

  // cache raw data for use by roles table
  cacheSeasonRawData(year, quarter, data);

  // build running collection of VAs, so all callbacks work with same data
  extractVAs(window.seasonalRolesCounter, window.voiceActors, data);

  if (asyncCount) {
    asyncCount = parseInt(asyncCount);
    asyncCount++;
    vaTableBody.setAttribute("data-async-count", asyncCount);
    if (asyncCount == window.mediaFormats.length) {
      sortedSeasonalVoiceActorIds = sortVaIdsByNumRoles(window.seasonalRolesCounter, window.voiceActors);
      fillVATableAndPage(sortedSeasonalVoiceActorIds);
      vaTableBody.setAttribute("data-async-count", 0);
      unlock();
    }
  } else {
    vaTableBody.setAttribute("data-async-count", 1);
  }

}

function cacheSeasonRawData(year, quarter, data) {

  // Build cache if required
  let done = false;
  while (!done) {
    if (window.seasonRawData[year]) {
      if (window.seasonRawData[year][quarter]) {
        done = true;
      }
      else {
        window.seasonRawData[year][quarter] = {};
      }
    }
    else {
      window.seasonRawData[year] = {};
    }
  }

  window.seasonRawData[year][quarter][window.seasonRawDataIndex] = data;
  window.seasonRawDataIndex++;
  if (window.seasonRawDataIndex == window.mediaFormats.length) {
    window.seasonRawDataIndex = 0;
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
