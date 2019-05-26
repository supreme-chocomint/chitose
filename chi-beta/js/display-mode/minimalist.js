var Minimalist = {

  name: "minimalist",
  tablePageSize: 5,

  init() {

    this.vaTable = document.querySelector(".minimalist.va-table");
    this.vaTableBody = document.querySelector(".minimalist.va-table-body");
    this.followTable = document.querySelector(".minimalist.follow-table");
    this.followTableBody = document.querySelector(".minimalist.follow-table-body");
    this.rolesTable = document.querySelector(".minimalist.roles-table");
    this.rolesTableBody = document.querySelector(".minimalist.roles-table-body");

    this.vaPopularTableBody = document.querySelector(".minimalist.va-popular-characters-body");
    this.vaUWTableBody = document.querySelector(".minimalist.va-uw-characters-body");
    this.vaMainTableBody = document.querySelector(".minimalist.va-main-characters-body");
    this.vaSupportTableBody = document.querySelector(".minimalist.va-support-characters-body");

    this.searchTableBody = this.vaTableBody;
    this.characterBrowseTableBody = this.vaTableBody;
    this.vaLanguageTable = document.querySelector(".minimalist.va-language-table");
    this.vaLanguageTableBody = document.querySelector(".minimalist.va-language-table-body");

  },

  activate() {

    let subs = document.getElementById("va-bottom-container").children;
    for (let sub of subs) {
      sub.classList.add("one-half");
      sub.classList.add("column");
    }

    let staticTopElements = document.querySelectorAll(".static-display-top");
    for (let e of staticTopElements) {
      if (e.classList.contains("minimalist")) {
        e.style.display = "";
      }
      else {
        e.style.display = "none";
      }
    }

  },

  // ---- Mutators ---- //

  addFollowTableEntry(metadata) {

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
    name.classList.add("clickable");
    name.classList.add("internal_link");
    name.onclick = function() {VADetailsOnClick(metadata.id)};

    url.innerHTML = "Show All";
    url.classList.add("clickable");
    url.classList.add("action_link");
    url.onclick = function() {VAOnClick(metadata.id)};

    deleteLink.innerHTML = getDeleteIcon();
    deleteLink.classList.add("clickable");
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
    this.followTableBody.appendChild(row);

  },

  clearFollowTable() {
    this.followTableBody.innerHTML = "";
  },

  addNoResultsIndicator(tableId, message) {
    let row = document.createElement("tr");
    this.appendNACells(row, 2);
    this.getTableBody(tableId).appendChild(row);
    if (message) {
      this.getTableBody(tableId).lastChild.firstChild.innerHTML +=
        " in selected entry/season";
    }
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
    let linkCol = document.createElement("td");
    let link = document.createElement("a");
    let numRolesCol = document.createElement("td");
    let numRoles = document.createElement("span");
    let followCol = document.createElement("td");
    let followState = document.createElement("a");

    name.innerHTML = metadata.name;
    name.classList.add("clickable");
    name.classList.add("internal_link");
    name.onclick = function() {VADetailsOnClick(metadata.id)};
    nameCol.appendChild(name);
    row.appendChild(nameCol);

    link.innerHTML = "Show All";
    link.classList.add("clickable");
    link.classList.add("action_link");
    link.onclick = function() {VAOnClick(metadata.id)};
    linkCol.appendChild(link);
    row.appendChild(linkCol);

    numRolesInt = window.seasonalRolesCounter[metadata.id];
    if (numRolesInt) {
      numRoles.innerHTML = numRolesInt;
      numRolesCol.appendChild(numRoles);
      row.appendChild(numRolesCol);
    }

    if (isFollowed(metadata.id)) { followState.innerHTML = getBlackStar(); }
    else { followState.innerHTML = getWhiteStar(); }
    followState.classList.add("clickable");
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
    this.vaTableBody.appendChild(row);

  },

  styleVATable() {

    let numElements = this.vaTableBody.children.length;
    let vaTableHeaderLink = document.getElementById("va-table-head-link");
    let vaTableHeaderRoles = document.getElementById("va-table-head-roles");
    let vaTableHeaderFollow = document.getElementById("va-table-head-follow");
    let vaTableHeaderExtra1 = document.getElementById("va-table-head-extra1");
    let vaTableState = this.vaTable.getAttribute("data-state");

    if (numElements == 0){
      vaTableHeaderLink.style.display = "";
      vaTableHeaderRoles.style.display = "none";
      vaTableHeaderFollow.style.display = "none";
      vaTableHeaderFollow.style.display = "none";
      vaTableHeaderExtra1.style.display = "none";
      addNoResultsIndicator("va-table-body");
    }

    else if (vaTableState == "search") {
      vaTableHeaderLink.style.display = "";
      vaTableHeaderRoles.style.display = "none";
      vaTableHeaderFollow.style.display = "";
      vaTableHeaderExtra1.style.display = "none";
    }

    else {
      vaTableHeaderLink.style.display = "";
      vaTableHeaderRoles.style.display = "";
      vaTableHeaderFollow.style.display = "";
      vaTableHeaderExtra1.style.display = "none";
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
    this.rolesTableBody.appendChild(row);

  },

  setRolesTableHeader(header) {
    let rolesTableCaption = document.getElementById("roles-table-caption");
    rolesTableCaption.setAttribute("data-content", header);
  },

  addCharacterEntry(tableBodyId, role, onclick) {

    let character = role.character;
    let show = role.show;

    let tableBody = this.getTableBody(tableBodyId);
    let row = document.createElement("tr");
    let charaCol = document.createElement("td");
    let characterLink = document.createElement("a");
    let characterEmbellish = document.createElement("span");
    let auxiliaryCol = document.createElement("td");
    let auxiliaryLink = document.createElement("a");
    let auxiliaryCol2 = document.createElement("td");
    let auxiliaryText = document.createElement("span");

    if (onclick) { // Link to character
      characterLink.onclick = onclick;
      characterLink.classList.add("clickable");
      characterLink.classList.add("action_link");
      auxiliaryLink.href = character.url;
      auxiliaryLink.target = "_blank";
      auxiliaryLink.innerHTML = "AniList";
    }
    else { // Link to character and show
      characterLink.href = character.url;
      characterLink.target = "_blank";
      auxiliaryLink.href = show.siteUrl;
      auxiliaryLink.target = "_blank";
      auxiliaryLink.innerHTML = show.title.romaji;
    }

    characterLink.innerHTML = character.name;

    charaCol.appendChild(characterLink);
    row.appendChild(charaCol);
    auxiliaryCol.appendChild(auxiliaryLink);
    row.appendChild(auxiliaryCol);

    if (show && show.seasonInt) {
      auxiliaryText.innerHTML += parsedSeasonInt(show.seasonInt);
      auxiliaryCol2.appendChild(auxiliaryText);
      row.appendChild(auxiliaryCol2);
    }

    if (character.nameEmbellish) {
      characterEmbellish.innerHTML = " " + character.nameEmbellish;
      charaCol.appendChild(characterEmbellish);
    }

    tableBody.appendChild(row);

  },

  getTableBody(id) {
    switch (id) {
      case "va-table-body":
        return this.vaTableBody;
        case "roles-table-body":
          return this.rolesTableBody;
      case "va-popular-characters":
        return this.vaPopularTableBody;
      case "va-uw-characters":
        return this.vaUWTableBody;
      case "va-main-characters":
        return this.vaMainTableBody;
      case "va-support-characters":
        return this.vaSupportTableBody;
      case "media-search-table-body":
        return this.searchTableBody;
      case "character-browse-table-body":
        return this.characterBrowseTableBody;
      case "va-language-table-body":
        return this.vaLanguageTableBody
    }
  },

  clearSideContainers() {
    this.vaPopularTableBody.innerHTML = "";
    this.vaUWTableBody.innerHTML = "";
  },

  clearBottomContainer() {
    this.vaMainTableBody.innerHTML = "";
    this.vaSupportTableBody.innerHTML = "";
  },

  resetFixedDimensions() {},

  addMediaSearchEntry(media) {

    let row = document.createElement("tr");
    let actionCol = document.createElement("td");
    let action = document.createElement("a");
    let urlCol = document.createElement("td");
    let url = document.createElement("a");

    action.classList.add("clickable");
    action.onclick = function() {
      unclick();
      collectMediaRoles(media);
    };
    action.innerHTML = media.title.romaji;
    action.classList.add("action_link");

    url.href = media.siteUrl;
    url.target = "_blank";
    url.innerHTML = "AniList";

    actionCol.appendChild(action);
    row.appendChild(actionCol);
    urlCol.appendChild(url);
    row.appendChild(urlCol);
    this.searchTableBody.appendChild(row);

  },

  setCharacterBrowseHeader(header) {
    this.setVATableHeader(header);
  },

  styleMediaSearchTable(){

    if (this.searchTableBody.children.length == 0) {
      addNoResultsIndicator("media-search-table-body");
    }

    document.getElementById("va-table-head-link").style.display = "none";
    document.getElementById("va-table-head-roles").style.display = "none";
    document.getElementById("va-table-head-follow").style.display = "none";
    document.getElementById("va-table-head-extra1").style.display = "";

  },

  styleCharacterBrowseTable() {

    if (this.characterBrowseTableBody.children.length == 0) {
      addNoResultsIndicator("character-browse-table-body");
    }

    document.getElementById("va-table-head-link").style.display = "none";
    document.getElementById("va-table-head-roles").style.display = "none";
    document.getElementById("va-table-head-follow").style.display = "none";
    document.getElementById("va-table-head-extra1").style.display = "";

  },

  addVALanguageEntry(voiceActor) {

    let row = document.createElement("tr");
    let nameCol = document.createElement("td");
    let langCol = document.createElement("td");
    let rolesCol = document.createElement("td");
    let mediaCol = document.createElement("td");
    let name = document.createElement("a");
    let lang = document.createElement("span");
    let roles = document.createElement("a");
    let media = document.createElement("a");

    name.onclick = function() {VADetailsOnClick(voiceActor.id)};
    name.classList.add("clickable");
    name.classList.add("internal_link");
    name.innerHTML = parsedName(voiceActor.name);
    lang.innerHTML = "<br>" + voiceActor.language + "<br>";
    roles.innerHTML = "See Roles";
    roles.classList.add("clickable");
    roles.classList.add("action_link");
    roles.onclick = function() {VAOnClick(voiceActor.id)};

    nameCol.appendChild(name);
    nameCol.appendChild(lang);
    nameCol.appendChild(roles);
    row.appendChild(nameCol);
    this.vaLanguageTableBody.appendChild(row);

    if (voiceActor.media) {

      let first = voiceActor.media[0];
      media.href = first.siteUrl;
      media.target = "_blank";
      media.innerHTML = first.title.romaji;
      mediaCol.appendChild(media);
      row.appendChild(mediaCol);
      // auto-updates table

      for (let other of voiceActor.media.slice(1)) {
        let newRow = document.createElement("tr");
        //let newCol1 = document.createElement("td");
        //let newCol2 = document.createElement("td");
        let newCol3 = document.createElement("td");
        let newCol4 = document.createElement("td");
        let newLink = document.createElement("a");
        newLink.href = other.siteUrl;
        newLink.target = "_blank";
        newLink.innerHTML = other.title.romaji;
        newCol4.appendChild(newLink);
        //newRow.appendChild(newCol1);
        //newRow.appendChild(newCol2);
        newRow.appendChild(newCol3);
        newRow.appendChild(newCol4);
        this.vaLanguageTableBody.appendChild(newRow);
      }

    }

  },

  setVaLanguageTableHeader(header) {
    let caption = document.getElementById("va-language-table-caption");
    caption.setAttribute("data-content", header);
  },

  styleVaLanguageTable(hasMediaEntries) {
    let entryHead = document.getElementById("va-language-table-head-entry");
    if (hasMediaEntries) {
      entryHead.style.display = "";
    }
    else {
      entryHead.style.display = "none";
    }
  },

  hideEntriesVaLanguageTable() {
    document.getElementById("va-language-table-head-entry").style.display = "none";
  },

  showEntriesVaLanguageTable() {
    document.getElementById("va-language-table-head-entry").style.display = "";
  }

}
