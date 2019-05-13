function importButtonOnClick() {

  let newFollows = document.getElementById("transfer-box").value;
  let followTableBody = document.getElementById("follow-table-body");
  let doImport = window.confirm("Importing will replace all existing follows. Are you sure?");

  if (doImport) {
    if (isJson(newFollows)) {
      localStorage.setItem("following", newFollows);
      followTableBody.innerHTML = "";
      populateFollowTable();
      followTableBody.setAttribute("data-changed", true);
    }
    else {
      window.alert("Import data invalid. No changes made to existing follows.");
    }
  }
}

function exportButtonOnClick() {
  let transferBox = document.getElementById("transfer-box");
  transferBox.value = JSON.stringify(getFollowing());
}
