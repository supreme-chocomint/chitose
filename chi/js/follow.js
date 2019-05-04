// Functions that directly handle followed voice actors

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

function setStorageState() {
  try {
    localStorage.getItem("following");
    console.log("Katta na! GAHAHA");
    return true;
  }
  catch (AccessDeniedError) {
    warningString = "Cookies and site data permissions must be enabled " +
    "for some site features to work. This includes the ability to follow voice actors."
    setTimeout(function() { window.alert(warningString); }, 1);
    disableFollowing();
    return false;
  }
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

  let followTableBody = document.getElementById("follow-table-body");
  let row = document.createElement("tr");
  let nameCol = document.createElement("td");
  let name = document.createElement("a");
  let urlCol = document.createElement("td");
  let url = document.createElement("a");
  let deleteCol = document.createElement("td");
  let deleteLink = document.createElement("a");

  row.id = metadata.id;
  name.classList.add(metadata.id);  // for coordinating with VA table
  if (window.clicked == metadata.id) {
    name.classList.add("clicked");
  }

  name.innerHTML = metadata.name;
  name.href = "javascript:void(0)";
  name.classList.add("internal_link");
  name.onclick = function() {VAOnClick(metadata.id)};

  url.innerHTML = "See on AniList";
  url.href = metadata.url;
  url.target = "_blank";  // open in new tab

  deleteLink.innerHTML = "&times;";
  deleteLink.href = "javascript:void(0)";
  deleteCol.classList.add("symbol");
  deleteLink.classList.add("symbol");
  deleteLink.onclick = function() {
    unfollow(metadata);
  }

  nameCol.appendChild(name);
  urlCol.appendChild(url);
  deleteCol.appendChild(deleteLink);
  row.appendChild(nameCol);
  row.appendChild(urlCol);
  row.appendChild(deleteCol);
  followTableBody.appendChild(row);

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
