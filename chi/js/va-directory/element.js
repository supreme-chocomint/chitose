// populate with VAs and paginate
function fillVATableAndPage(voiceActorIds) {

  let tableBody = document.getElementById("va-table-body");
  let pageSize = 5;

  tableBody.style.visibility = "none";  // to hide build process
  let entryCount = 0;

  for (let id of voiceActorIds) {

    let va = window.voiceActors[id];
    addVATableEntry(va);
    updateLanguageFilter(va.language);
    let row = tableBody.lastChild;
    row.id = entryCount;

    if (entryCount >= pageSize) {
      tableBody.children[entryCount].style.display = "none";
    }

    entryCount++;

  }

  setVATableSize(voiceActorIds.length);
  setNavigationState(tableBody, pageSize, "ALL");

}

function addVATableEntry(metadata) {

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
  name.classList.add("internal_link");
  name.onclick = function() {VAOnClick(metadata.id)};
  nameCol.appendChild(name);
  row.appendChild(nameCol);

  image.src = metadata.image;
  image.alt = metadata.name;
  image.style.display = "none";
  imageCol.appendChild(image);

  link.innerHTML = "Details";
  link.href = "javascript:void(0)";
  link.classList.add("internal_link");
  link.onclick = function() {VADetailsOnClick(metadata.id)};
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

}

// Assumes page exists: will make empty page if it doesn't
function switchToPage(pageIndex, language) {

  let body = document.getElementById("va-table-body");
  let pageTracker = document.getElementById("page-tracker");
  let pageSize = body.getAttribute("data-pageSize");
  let pageCount = body.getAttribute("data-pageCount");
  body.style.display = "none";  // hide build process

  if (language != "ALL") {

    let ofLanguageIndex = 0;
    let entryIndex = 0;
    for (let child of body.children) {
      if (child.classList.contains(language)) {
        if ( (pageSize * pageIndex <= ofLanguageIndex) &&
             (ofLanguageIndex < pageSize * (pageIndex + 1)) ) {
           try {
             body.children[entryIndex].style.display = "";
           }
           catch (IndexError) { // this page is not full
             console.log("Pg." + pageIndex + ", e." + entryIndex +
                        " doesn't exist. Probably expected behaviour.");
           }
        }
        else {
          child.style.display = "none";
        }
        ofLanguageIndex++;
      }
      else {
        child.style.display = "none";
      }
      entryIndex++;
    }

  }

  else {

    for (let child of body.children) {
      child.style.display = "none";
    }

    for (let i = pageSize * pageIndex; i < pageSize * (pageIndex + 1); i++) {
      try {
        body.children[i].style.display = "";
      }
      catch (IndexError) { // this page is not full
        console.log("Pg." + pageIndex + ", e." + i + " doesn't exist. Probably expected behaviour.");
      }
    }

  }

  body.style.display = "";
  pageTracker.innerHTML = (pageIndex + 1).toString() + "/" + pageCount.toString();

}

function setVATableSize(numElements) {

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

}

function setNavigationState(tableBody, pageSize, filter) {

  let pageCount;

  if (filter == "ALL") {
    pageCount = Math.ceil(tableBody.childElementCount / pageSize);
  } else {
    pageCount = Math.ceil(tableBody.querySelectorAll("." + filter).length / pageSize);
  }

  if (pageCount == 0){ pageCount++; }

  tableBody.style.display = "";
  tableBody.setAttribute("data-pageIndex", 0);
  tableBody.setAttribute("data-pageSize", pageSize);
  tableBody.setAttribute("data-pageCount", pageCount);

  if (pageCount == 1) {
    document.getElementById("right-nav").classList.add("inactive");
  } else {
    document.getElementById("right-nav").classList.remove("inactive");
  }

  document.getElementById("page-tracker").innerHTML = "1/" + pageCount.toString();

}

function setVATableState(stateString) {
  document.getElementById("va-table").setAttribute("data-state", stateString);
}

function clearVATable() {
  let tableBody = document.getElementById("va-table-body");
  tableBody.innerHTML = "";
  tableBody.setAttribute("data-pageIndex", 0);
  tableBody.setAttribute("data-pageCount", 1);
  document.getElementById("left-nav").classList.add("inactive");
  document.getElementById("right-nav").classList.add("inactive");
  document.getElementById("va-table-caption").setAttribute("data-content", "");
}

function resetVaTablePages(language) {
  document.getElementById("va-table-body").setAttribute("data-pageIndex", 0);
  document.getElementById("left-nav").classList.add("inactive");
  document.getElementById("right-nav").classList.remove("inactive");
  switchToPage(0, language);
}
