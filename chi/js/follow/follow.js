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

  for (let id of idArray) {
    let variables = { id: id };
    makeRequest(
      getQuery("VA ID"),
      variables,
      function(data) {
        // Need length to unlock when done
        collectFollowingCallback(idArray.length, data);
      }
    );
  }

}

function collectFollowingCallback(numFollowing, data) {

  let staff = data.data.Staff;
  let metadata = {
    id: staff.id,
    name: parsedName(staff.name),
    url: staff.siteUrl
  }

  addFollowTableEntry(metadata);

  let numEntries = document.getElementById("follow-table-body").children.length;
  if (numEntries == numFollowing) {
    unlock();
  }

}
