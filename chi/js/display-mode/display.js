var Grid = {
  name: "grid",
  tablePageSize: 6
}

var Minimalist = {

  name: "minimalist",
  tablePageSize: 5,

  addFollowTableEntry(metadata) {

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
    name.onclick = function() {VADetailsOnClick(metadata.id)};

    url.innerHTML = "Show All";
    url.href = "javascript:void(0)";
    url.classList.add("internal_link");
    url.onclick = function() {VAOnClick(metadata.id)};

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

  },

  addNoResultsIndicator(tableId) {
    let row = document.createElement("tr");
    this.appendNACells(row, 2);
    document.getElementById(tableId).appendChild(row);
  },

  appendNACells(row, numCol) {
    for (let i = 0; i < numCol; i++) {
      let col = document.createElement("td");
      col.innerHTML = "N/A";
      row.appendChild(col);
    }
  },

  addVATableEntry(metadata) {

    let row = document.createElement("tr");
    let nameCol = document.createElement("td");
    let name = document.createElement("a");
    let imageCol = document.createElement("td");
    let image = document.createElement("img");
    let linkCol = document.createElement("td");
    let link = document.createElement("a");
    let numRolesCol = document.createElement("td");
    let numRoles = document.createElement("span");
    let followCol = document.createElement("td");
    let followState = document.createElement("a");

    name.innerHTML = metadata.name;
    name.href = "javascript:void(0)";
    name.onclick = function() {VADetailsOnClick(metadata.id)};
    nameCol.appendChild(name);
    row.appendChild(nameCol);

    image.src = metadata.image;
    image.alt = metadata.name;
    image.style.display = "none";
    imageCol.appendChild(image);

    link.innerHTML = "Show All";
    link.href = "javascript:void(0)";
    link.classList.add("internal_link");
    link.onclick = function() {VAOnClick(metadata.id)};
    linkCol.appendChild(link);
    row.appendChild(linkCol);

    numRolesInt = window.seasonalRolesCounter[metadata.id];
    if (numRolesInt) {
      numRoles.innerHTML = numRolesInt;
      numRolesCol.appendChild(numRoles);
      row.appendChild(numRolesCol);
    }

    if (isFollowed(metadata.id)) { followState.innerHTML = "★"; }
    else { followState.innerHTML = "☆"; }
    followState.href = "javascript:void(0)";
    followState.classList.add("symbol");  // makes character larger
    followCol.classList.add("symbol");  // centers character
    followState.onclick = function() {
      followState.innerHTML = toggleFollow(metadata);
    }

    name.classList.add(metadata.id);
    if (window.clicked == metadata.id) {
      name.classList.add("clicked");
    }
    followCol.appendChild(followState);
    row.appendChild(followCol);

    row.classList.add(metadata.language);
    document.getElementById("va-table-body").appendChild(row);

  },

  setVATableSize(numElements) {

    let vaTable = document.getElementById("va-table");
    let vaTableHeaderRoles = document.getElementById("va-table-header-roles");
    let vaTableHeaderFollow = document.getElementById("va-table-header-follow");
    let vaTableState = vaTable.getAttribute("data-state");

    if (numElements == 0){
      vaTableHeaderRoles.style.display = "none";
      vaTableHeaderFollow.style.display = "none";
      addNoResultsIndicator("va-table-body");
    }

    else if (vaTableState == "search") {
      vaTableHeaderRoles.style.display = "none";
      vaTableHeaderFollow.style.display = "";
    }

    else {
      vaTableHeaderRoles.style.display = "";
      vaTableHeaderFollow.style.display = "";
    }
  },

  setVATableHeader(header) {
    let vaTableCaption = document.getElementById("va-table-caption");
    vaTableCaption.setAttribute("data-content", header);
  },

  addRolesTableEntry(metadata) {

    let row = document.createElement("tr");
    let showNameCol = document.createElement("td");
    let showName = document.createElement("a");
    let charaNameCol = document.createElement("td");
    let charaName = document.createElement("a");

    showName.innerHTML = metadata.showName;
    showName.href = metadata.showUrl;
    showName.target = "_blank";  // open in new tab
    charaName.innerHTML = metadata.characterName;
    charaName.href = metadata.characterUrl;
    charaName.target = "_blank";  // open in new tab

    showNameCol.appendChild(showName);
    charaNameCol.appendChild(charaName);
    row.appendChild(showNameCol);
    row.appendChild(charaNameCol);
    document.getElementById("roles-table-body").appendChild(row);

  },

  setRolesTableHeader(header) {
    let rolesTableCaption = document.getElementById("roles-table-caption");
    rolesTableCaption.setAttribute("data-content", header);
  }

}
