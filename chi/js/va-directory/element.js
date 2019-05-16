// populate with VAs and paginate
function fillVATableAndPage(voiceActorIds) {

  let tableBody = window.currentDisplay.vaTableBody;
  let pageSize = window.currentDisplay.tablePageSize;

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

  styleVATable();
  setNavigationState(tableBody, pageSize, "ALL");

}

function addVATableEntry(metadata) {
  window.currentDisplay.addVATableEntry(metadata);
}

// Assumes page exists: will make empty page if it doesn't
function switchToPage(pageIndex, language) {

  let body = window.currentDisplay.vaTableBody;
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

function styleVATable() {
  window.currentDisplay.styleVATable();
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
  window.currentDisplay.vaTable.setAttribute("data-state", stateString);
}

function clearVATable() {

  let tableBody = window.currentDisplay.vaTableBody;
  tableBody.innerHTML = "";
  tableBody.setAttribute("data-pageIndex", 0);
  tableBody.setAttribute("data-pageCount", 1);

  document.getElementById("left-nav").classList.add("inactive");
  document.getElementById("right-nav").classList.add("inactive");
  document.getElementById("language-filter").innerHTML = "";
  updateLanguageFilter("ALL");

  window.currentDisplay.setVATableHeader("");

}

function resetVaTablePages(language) {
  window.currentDisplay.vaTable.setAttribute("data-pageIndex", 0);
  document.getElementById("left-nav").classList.add("inactive");
  document.getElementById("right-nav").classList.remove("inactive");
  switchToPage(0, language);
}
