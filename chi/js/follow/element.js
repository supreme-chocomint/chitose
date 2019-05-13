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

  url.innerHTML = "Details";
  url.href = "javascript:void(0)";
  url.classList.add("internal_link");
  url.onclick = function() {VADetailsOnClick(metadata.id)};

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
