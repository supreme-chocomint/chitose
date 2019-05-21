function isFollowed(voiceActorId) {
  try {
    let following = getFollowing();
    if (following) {
      return Boolean(following[voiceActorId]);
    } else if (following == {}) {
      return false;
    }
  }
  catch (AccessDeniedError) {
    return false;
  }
}

function getFollowing() {
  let following = JSON.parse(localStorage.getItem("following"));
  if (following) {
    return following;
  }
  else {
    return {};
  }
}

function populateFollowTable() {

  let following = getFollowing();
  let idArray = Object.keys(following);
  window.currentDisplay.clearFollowTable();

  let errorHandler = function(error) {
    let status = error.errors[0].status;
    let dummy = document.createElement("span");
    window.currentDisplay.followTableBody.appendChild(dummy);  // so async works
    console.log(error);
    if (window.importErrors) {
      indow.importErrors++;
    } else {
      window.importErrors = 1;
    }
  }

  for (let id of idArray) {
    let variables = { id: id };
    makeRequest(
      getQuery("VA ID"),
      variables,
      function(data) {
        // Need length to unlock when done
        collectFollowingCallback(idArray.length, data);
      },
      errorHandler
    );
  }

}

function collectFollowingCallback(numFollowing, data) {

  let staff = data.data.Staff;
  let metadata = {
    id: staff.id,
    name: parsedName(staff.name),
    url: staff.siteUrl,
    image: staff.image.large,
    language: staff.language
  }

  addFollowTableEntry(metadata);
  if (window.voiceActors[staff.id] == undefined) {
    window.voiceActors[staff.id] = metadata;
  }

  let numEntries = window.currentDisplay.followTableBody.children.length;
  if (numEntries == numFollowing) {
    if (window.importErrors != undefined && window.importErrors != 0) {
      window.alert(`Failed to import ${window.importErrors} voice actors; no response from AniList`);
      window.importErrors = 0;
    }
    unlock();
  }

}
