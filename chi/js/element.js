// Functions directly involved with manipulating HTML elements.
// Includes dynamically building/clearing/hiding tables, inputs, and buttons.

function setDescription() {
  let descriptionBox = document.getElementById("description-text");
  let aniListLink = "<a href='https://anilist.co/' target = '_blank'>AniList</a>"
  descriptionBox.innerHTML = "Find out what your favorite voice actors are " +
    "up to this season (or any season) !<br> Browse a season by number " +
    "of roles, or search by name, and click on the one you want to see from the " +
    "left-hand / top table.<br> The right-hand / bottom table will generate " +
    "all TV shows, TV shorts, and ONAs they're involved in.<br>" +
    "Follow a voice actor by clicking the star icon, and view all follows " +
    "by clicking the 'toggle following' button.<br><br>" +
    "Things not loading? Double-check that " + aniListLink +
    " (the data provider) is online."
}

function hideElements() {
  document.getElementById("follow-table").style.display = "none";
  document.getElementById("transfer").style.display = "none";
}

function buildSeasonPickers() {
  buildYearPicker();
  buildQuarterPicker();
}

function buildYearPicker() {
  let yearPicker = document.getElementById("year-picker");
  for (let year = 1950; year <= 2020; year++) {
    let option = document.createElement("option");
    option.value = year;
    option.innerHTML = year;
    yearPicker.appendChild(option);
  }
  yearPicker.onchange = function() { onSeasonChange(); };
}

function buildQuarterPicker() {
  let quarterPicker = document.getElementById("quarter-picker");
  let quarters = ["WINTER", "SPRING", "SUMMER", "FALL"]
  for (let quarter of quarters) {
    let option = document.createElement("option");
    option.value = quarter;
    option.innerHTML = quarter;
    quarterPicker.appendChild(option);
  }
  quarterPicker.onchange = function() { onSeasonChange(); };
}

function clearInputBoxes() {
  document.getElementById("search-bar").value = "";
  document.getElementById("transfer-box").value = "";
}

function setSeason(year, quarter) {
  if (!year || !quarter) {
    let quarters = {0: "WINTER", 1: "SPRING", 2: "SUMMER", 3:"FALL"};
    let quarterIndex = Math.floor(new Date().getMonth() / 3);
    year = new Date().getFullYear();
    quarter = quarters[quarterIndex];
  }
  document.getElementById("year-picker").value = year;
  document.getElementById("quarter-picker").value = quarter;
}

// Assumes page exists: will make empty page if it doesn't
function switchToPage(pageIndex) {

  let body = document.getElementById("va-table-body");
  let pageTracker = document.getElementById("page-tracker");
  let pageSize = body.getAttribute("data-pageSize");
  let pageCount = body.getAttribute("data-pageCount");
  body.style.display = "none";  // hide build process

  for (let child of body.children) {
    child.style.display = "none";
  }

  for (let i = pageSize * pageIndex; i < pageSize * (pageIndex + 1); i++) {
    try {
      body.children[i].style.display = "";
    }
    catch (IndexError) { // this page is not full
      appendEmptyRow(body); // to keep table same size
      console.log("Pg." + pageIndex + ", e." + i + " doesn't exist. Probably expected behaviour.");
    }
  }

  body.style.display = "";
  pageTracker.innerHTML = (pageIndex + 1).toString() + "/" + pageCount.toString();

}

function appendEmptyRow(body) {
  let emptyRow = document.createElement("tr");
  let emptyCellA = document.createElement("td");
  let emptyCellB = document.createElement("td");
  emptyCellA.innerHTML = "N/A";
  emptyCellB.innerHTML = "N/A";
  emptyRow.appendChild(emptyCellA);
  emptyRow.appendChild(emptyCellB);
  body.appendChild(emptyRow);
}

// populate with VAs and paginate
function fillVATableAndPage(voiceActorArray) {

  let tableBody = document.getElementById("va-table-body");
  let pageSize = 5;

  tableBody.style.visibility = "none";  // to hide build process
  let entryCount = 0;

  for (let va of voiceActorArray) {
    let metadata = {
      id: va[0],
      name: va[1],
      url: va[3]
    };
    addVATableEntry(metadata);
    let row = tableBody.lastChild;
    row.id = entryCount++;
  }

  for (let j = pageSize; j < entryCount; j++) {
    tableBody.children[j].style.display = "none";
  }

  setNavigationState(tableBody, pageSize);

  if (entryCount == 0) {
    addNoResultsIndicator("va-table-body");
  }

}

function setNavigationState(tableBody, pageSize) {

  let pageCount = Math.ceil(tableBody.childElementCount / pageSize);
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

function addRolesTableEntry(metadata) {

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

}

// So user is notified if search is done but no results
function addNoResultsIndicator(tableId) {

  let row = document.createElement("tr");
  let showNameCol = document.createElement("td");
  let charaNameCol = document.createElement("td");

  showNameCol.innerHTML = "N/A";
  charaNameCol.innerHTML = "N/A";

  row.appendChild(showNameCol);
  row.appendChild(charaNameCol);
  document.getElementById(tableId).appendChild(row);

}

function addVATableEntry(metadata) {

  let row = document.createElement("tr");
  let nameCol = document.createElement("td");
  let name = document.createElement("a");
  let urlCol = document.createElement("td");
  let url = document.createElement("a");
  let followCol = document.createElement("td");
  let followState = document.createElement("a");

  name.innerHTML = metadata.name;
  name.href = "javascript:void(0)";
  name.classList.add("internal_link");
  name.onclick = function() {VAOnClick(metadata.id)};

  url.innerHTML = "See on AniList";
  url.href = metadata.url;
  url.target = "_blank";  // open in new tab

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

  nameCol.appendChild(name);
  urlCol.appendChild(url);
  followCol.appendChild(followState);
  row.appendChild(nameCol);
  row.appendChild(urlCol);
  row.appendChild(followCol);
  document.getElementById("va-table-body").appendChild(row);

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

function clearRolesTable() {
  let table = document.getElementById("roles-table-body");
  table.innerHTML = "";
  table.setAttribute("data-async-count", 0);
}
