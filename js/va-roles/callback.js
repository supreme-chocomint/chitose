// Allows for empty response reporting and unlocking
// after all parallel requests are finished.
function collectSeasonalRolesCallback(voiceActorId, year, quarter, data) {

  collectSeasonalRoles(voiceActorId, data);
  cacheSeasonRawData(year, quarter, data);

  let rolesTable = window.currentDisplay.rolesTable;
  let rolesTableBody = window.currentDisplay.rolesTableBody;
  let asyncCount = rolesTableBody.getAttribute("data-async-count");

  if (asyncCount) {
    asyncCount = parseInt(asyncCount);
    rolesTableBody.setAttribute("data-async-count", asyncCount + 1);
    if ((asyncCount + 1) == window.mediaFormats.length) {
      rolesTableBody.setAttribute("data-async-count", 0);
      if (rolesTableBody.innerHTML == "") {
        addNoResultsIndicator("roles-table-body");
      }
      conditionalScrollIntoView(rolesTable);  // scroll to table in general, rather than just body
      unlock();
    }
  } else {
    rolesTableBody.setAttribute("data-async-count", 1);
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

function hasVoiceActor(charaData, voiceActorId) {
  for (let referenceVA of getVoiceActors(charaData)) {
    if (referenceVA.id == voiceActorId) {
      return true;
    };
  };
  return false;
}
