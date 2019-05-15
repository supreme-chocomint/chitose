function clearTransferBox() {
  document.getElementById("transfer-box").value = "";
}

function disableFollowing() {

  let vaTable = document.getElementById("va-table");
  vaTable.style.display = "";

  document.getElementById("follow-table").style.display = "none";
  document.getElementById("left-table-switch").disabled = true;

}

function toggleFollow(voiceActorMetadata) {
  following = getFollowing();
  if (following == {}) {
    follow(voiceActorMetadata);
    return "★";
  }
  else if (voiceActorMetadata.id in following) {
    unfollow(voiceActorMetadata);
    return "☆";
  }
  else {
    follow(voiceActorMetadata);
    return "★";
  }
}

function follow(voiceActorMetadata) {
  let allFollowing = getFollowing();
  allFollowing[voiceActorMetadata.id] = true;
  localStorage.setItem("following", JSON.stringify(allFollowing));
  addFollowTableEntry(voiceActorMetadata);
}

function unfollow(voiceActorMetadata) {
  allFollowing = getFollowing();
  delete allFollowing[voiceActorMetadata.id];
  localStorage.setItem("following", JSON.stringify(allFollowing));
  removeFollowTableEntry(voiceActorMetadata.id);
}

function addFollowTableEntry(metadata) {
  window.currentDisplay.addFollowTableEntry(metadata);
}

function removeFollowTableEntry(voiceActorId) {
  let body = document.getElementById("follow-table-body");
  for (let row of body.children) {
    if (row.id == voiceActorId) {
      body.removeChild(row);
      body.setAttribute("data-changed", true);
      break;  // id is unique, so get out
    }
  }
}
