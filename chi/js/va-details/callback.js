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

  let total = 0;
  let main = 0;

  for (let role of va.roles) {
    if (role.character.characterRole == "MAIN") {
      main += role.character.favourites;
    }
    total += role.character.favourites;
  }

  main = (main == 0) ? 0 : Math.round(main / va.characterSpread.MAIN);
  total = (total == 0) ? 0 : Math.round(total / va.rolesCount);

  return {
    main: main,
    total: total
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

function addPopularCharacters(va, numRoles) {

  let roles = va.roles.slice(); // copy
  sortRolesByFavourites(roles);
  va.popularRoles = [];

  let n = 0;
  for (role of roles) {
    if (role.character.favourites >= 30) {
      va.popularRoles.push(role);
      n++;
    }
    if (n == numRoles) {
      break;
    }
  }

}

function addUwCharacters(va, numRoles) {

  let roles = va.roles.slice(); // copy
  sortRolesByShowPopularity(roles);
  roles.reverse();  // low to high popularity

  roles = roles.filter(function(role) {
    if ( va.popularRoles.includes(role) ) {
      return false;
    }
    if (role.show.popularity >= 30000) {
      return false;
    }
    if (role.character.characterRole == "MAIN") {
      return true;
    }
    if (role.character.favourites <= 10) {
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
