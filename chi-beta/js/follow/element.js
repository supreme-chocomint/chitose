function clearTransferBox() {
  document.getElementById("transfer-box").value = "";
}

function disableFollowing() {

  let vaTable = window.currentDisplay.vaTable;
  vaTable.style.display = "";

  window.currentDisplay.followTable.style.display = "none";
  document.getElementById("left-table-switch").disabled = true;

}

function toggleFollow(voiceActorMetadata) {
  following = getFollowing();
  if (following == {}) {
    follow(voiceActorMetadata);
    return getBlackStar();
  }
  else if (voiceActorMetadata.id in following) {
    unfollow(voiceActorMetadata);
    return getWhiteStar();
  }
  else {
    follow(voiceActorMetadata);
    return getBlackStar();
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
  let body = window.currentDisplay.followTableBody;
  for (let row of body.children) {
    if (row.id == voiceActorId) {
      body.removeChild(row);
      body.setAttribute("data-changed", true);
      break;  // id is unique, so get out
    }
  }
}

function getBlackStar() {
  return "<i class='fas fa-star'></i>";
}

function getWhiteStar() {
  return "<i class='far fa-star'></i>";
}

function getDeleteIcon() {
  return "<i class='fas fa-times'></i>";
}
