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
    this.vaLanguageTableBody = this.rolesTableBody;

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
    name.href = "javascript:void(0)";
    name.onclick = function() {VADetailsOnClick(metadata.id)};

    url.innerHTML = "Show All";
    url.href = "javascript:void(0)";
    url.classList.add("internal_link");
    url.onclick = function() {VAOnClick(metadata.id)};

    deleteLink.innerHTML = getDeleteIcon();
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
    this.followTableBody.appendChild(row);

  },

  clearFollowTable() {
    this.followTableBody.innerHTML = "";
  },

  addNoResultsIndicator(tableId) {
    let row = document.createElement("tr");
    this.appendNACells(row, 2);
    if (tableId == "va-table-body") {
      this.vaTableBody.appendChild(row);
    } else if (tableId == "roles-table-body"){
      this.rolesTableBody.appendChild(row);
    } else if (tableId == "media-search-table-body") {
      this.searchTableBody.appendChild(row);
    } else if (tableId == "character-browse-table-body") {
      this.characterBrowseTableBody.appendChild(row);
    } else if (tableId == "va-language-table-body") {
      this.vaLanguageTableBody.appendChild(row);
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

    if (isFollowed(metadata.id)) { followState.innerHTML = getBlackStar(); }
    else { followState.innerHTML = getWhiteStar(); }
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
    document.getElementById("roles-table-head-show").style.display = "";
    document.getElementById("roles-table-head-character").style.display = "";
    document.getElementById("roles-table-head-extra1").style.display = "none";
    document.getElementById("roles-table-head-extra2").style.display = "none";
  },

  addCharacterEntry(containerId, role, onclick) {

    let character = role.character;
    let show = role.show;
    let tableBody;

    switch (containerId) {
      case "va-popular-characters":
        tableBody = this.vaPopularTableBody;
        break;
      case "va-uw-characters":
        tableBody = this.vaUWTableBody;
        break;
      case "va-main-characters":
        tableBody = this.vaMainTableBody;
        break;
      case "va-support-characters":
        tableBody = this.vaSupportTableBody;
        break;
      case "character-browse-table-body":
        tableBody = this.vaTableBody;
    }

    let row = document.createElement("tr");
    let charaCol = document.createElement("td");
    let characterLink = document.createElement("a");
    let auxiliaryCol = document.createElement("td");
    let auxiliaryLink = document.createElement("a");

    if (onclick) {
      characterLink.onclick = onclick;
      characterLink.href = "javascript:void(0)";
      auxiliaryLink.href = character.url;
      auxiliaryLink.target = "_blank";
      auxiliaryLink.innerHTML = "AniList";
    } else {
      characterLink.href = character.url;
      characterLink.target = "_blank";
      auxiliaryLink.href = show.siteUrl;
      auxiliaryLink.target = "_blank";
      auxiliaryLink.innerHTML = show.title.romaji;
    }

    characterLink.innerHTML = character.name;
    characterLink.style.fontWeight = 'bold';

    charaCol.appendChild(characterLink);
    row.appendChild(charaCol);
    auxiliaryCol.appendChild(auxiliaryLink);
    row.appendChild(auxiliaryCol);

    tableBody.appendChild(row);

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

    action.href = "javascript:void(0)";
    action.onclick = function() {
      collectMediaRoles(media);
    };
    action.innerHTML = media.title.romaji;

    url.href = media.siteUrl;
    url.target = "_blank";
    url.innerHTML = "AniList";

    actionCol.appendChild(action);
    row.appendChild(actionCol);
    urlCol.appendChild(url);
    row.appendChild(urlCol);
    this.searchTableBody.appendChild(row);

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
    let name = document.createElement("a");
    let lang = document.createElement("span");

    name.onclick = function() {VADetailsOnClick(voiceActor.id)};
    name.href = "javascript:void(0)";
    name.innerHTML = parsedName(voiceActor.name);
    lang.innerHTML = voiceActor.language;

    langCol.appendChild(lang);
    nameCol.appendChild(name);
    row.appendChild(nameCol);
    row.appendChild(langCol);
    this.vaLanguageTableBody.appendChild(row);

  },

  setVaLanguageTableHeader(header) {

    this.setRolesTableHeader(header);
    document.getElementById("roles-table-head-show").style.display = "none";
    document.getElementById("roles-table-head-character").style.display = "none";

    // Must go after call, as setRolesTableHeader() explicitly hides these
    document.getElementById("roles-table-head-extra1").style.display = "";
    document.getElementById("roles-table-head-extra2").style.display = "";

  }

}

var Grid = {

  name: "grid",
  tablePageSize: 6,

  init() {

    this.vaTable = document.querySelector(".grid.va-table");
    this.vaTableBody = document.querySelector(".grid.va-table-body");
    this.followTable = document.querySelector(".grid.follow-table");
    this.followTableBody = document.querySelector(".grid.follow-table-body");
    this.rolesTable = document.querySelector(".grid.roles-table");
    this.rolesTableBody = document.querySelector(".grid.roles-table-body");

    this.vaTableHeader = document.getElementById("va-table-header");
    this.rolesTableHeader = document.getElementById("roles-table-header");

    this.vaPopularTableBody = document.querySelector(".grid.va-popular-characters-body");
    this.vaUWTableBody = document.querySelector(".grid.va-uw-characters-body");
    this.vaMainTableBody = document.querySelector(".grid.va-main-characters-body");
    this.vaSupportTableBody = document.querySelector(".grid.va-support-characters-body");

    this.searchTableBody = this.vaTableBody;
    this.characterBrowseTableBody = this.vaTableBody;
    this.vaLanguageTableBody = this.rolesTableBody;

  },

  activate() {

    document.getElementById("va-left-container").classList.add("grid");
    document.getElementById("va-right-container").classList.add("grid");
    document.getElementById("va-bottom-container").classList.add("grid");
    document.getElementById("left-col").classList.add("grid");
    document.getElementById("right-col").classList.add("grid");

    let staticTopElements = document.querySelectorAll(".static-display-top");
    for (let e of staticTopElements) {
      if (e.classList.contains("grid")) {
        e.style.display = "";
      }
    }

  },

  addFollowTableEntry(metadata) {

    let div = document.createElement("div");
    let thumbnail = document.createElement("div");
    let text = document.createElement("p");
    let nameLink = document.createElement("a");
    let seasonLink = document.createElement("a");
    let deleteWrapper = document.createElement("div");
    let deleteLink = document.createElement("span");

    div.id = metadata.id;

    // ----- Thumbnail ----- //

    thumbnail.style.backgroundImage = `url(${metadata.image})`;
    thumbnail.classList.add("thumbnail");

    // ----- Delete icon ----- //

    deleteLink.innerHTML = getDeleteIcon();
    deleteLink.classList.add("thumbnail-icon");
    deleteWrapper.onclick = function() { unfollow(metadata); }
    deleteWrapper.classList.add("thumbnail-icon-wrapper");
    deleteWrapper.appendChild(deleteLink);
    thumbnail.appendChild(deleteWrapper);
    div.appendChild(thumbnail);

    // ----- Name ----- //

    nameLink.innerHTML = metadata.name;
    nameLink.href = "javascript:void(0);";
    nameLink.onclick = function() {VADetailsOnClick(metadata.id)};
    text.appendChild(nameLink);
    text.appendChild(document.createElement("br"));

    // ----- Roles link ----- //

    seasonLink.href = "javascript:void(0)";
    seasonLink.innerHTML += "Show Roles";
    seasonLink.classList.add("internal_link");
    seasonLink.onclick = function() {VAOnClick(metadata.id)};
    text.appendChild(seasonLink);
    text.appendChild(document.createElement("br"));

    // ----- Finish up ----- //

    text.classList.add("thumbnail-caption");
    div.appendChild(text);

    div.classList.add("thumbnail-wrapper");
    this.followTableBody.appendChild(div);

    this.followTableBody.lastChild.style.width = window.getComputedStyle(thumbnail).width;

  },

  clearFollowTable() {
    this.followTableBody.innerHTML = "";
  },

  addNoResultsIndicator(tableId, message) {

    let text = document.createElement("p");
    text.classList.add("grid-table-message");
    text.innerHTML = "Nothing found :(";

    if (tableId == "va-table-body") {
      this.vaTableBody.appendChild(text);
    } else if (tableId == "roles-table-body"){
      this.rolesTableBody.appendChild(text);
    } else if (tableId == "media-search-table-body") {
      this.searchTableBody.appendChild(text);
    } else if (tableId == "character-browse-table-body") {
      this.characterBrowseTableBody.appendChild(text);
    } else if (tableId == "va-language-table-body") {
      text.innerHTML += "<br>" + message;
      this.vaLanguageTableBody.appendChild(text);
    }

  },

  addVATableEntry(metadata) {

    let div = document.createElement("div");
    let thumbnail = document.createElement("div");
    let text = document.createElement("p");
    let nameLink = document.createElement("a");
    let seasonLink = document.createElement("a");
    let followWrapper = document.createElement("div");
    let followState = document.createElement("span");

    div.id = metadata.id;

    // ----- Thumbnail ----- //

    thumbnail.style.backgroundImage = `url(${metadata.image})`;
    thumbnail.classList.add("thumbnail");

    // ----- Follow icon ----- //

    if (isFollowed(metadata.id)) { followState.innerHTML = getBlackStar(); }
    else { followState.innerHTML = getWhiteStar(); }
    followState.classList.add("thumbnail-icon");
    followWrapper.onclick = function() {
      followState.innerHTML = toggleFollow(metadata);
    }
    followWrapper.classList.add("thumbnail-icon-wrapper");

    followWrapper.appendChild(followState);
    thumbnail.appendChild(followWrapper);
    div.appendChild(thumbnail);

    // ----- Name ----- //

    nameLink.innerHTML = metadata.name;
    nameLink.href = "javascript:void(0)";
    nameLink.onclick = function() {VADetailsOnClick(metadata.id);};
    text.appendChild(nameLink);
    text.appendChild(document.createElement("br"));

    // ----- Roles count ----- //

    numRolesInt = window.seasonalRolesCounter[metadata.id];
    if (numRolesInt) {
      seasonLink.innerHTML = `Roles: ${numRolesInt}`;
    } else {
      seasonLink.innerHTML = "Show Roles";
    }
    seasonLink.href = "javascript:void(0)";
    seasonLink.classList.add("internal_link");
    seasonLink.onclick = function() {VAOnClick(metadata.id)};
    text.appendChild(seasonLink);
    text.appendChild(document.createElement("br"));

    // ----- Finish up ----- //

    text.classList.add("thumbnail-caption");
    div.classList.add("thumbnail-wrapper");
    div.classList.add(metadata.language);

    div.appendChild(text);
    this.vaTableBody.appendChild(div);

    this.vaTableBody.lastChild.style.width = window.getComputedStyle(thumbnail).width;

  },

  styleVATable(resize) {

    let numElements = this.vaTableBody.children.length;
    let free = this.tablePageSize - (numElements % this.tablePageSize);
    let addPageIndex = Math.ceil((numElements - 1) / this.tablePageSize);
    let maxHeight = 0;
    let largest;
    let clones = [];

    this.vaTableBody.style.height = ""; // make height default to work with

    if (numElements == 0){
      this.addNoResultsIndicator("va-table-body");
      return;
    }

    if (resize == false) {
      return;
    }

    for (let child of this.vaTableBody.children) {
      if (child.clientHeight > maxHeight){
        maxHeight = child.clientHeight;
        largest = child;
      }
    }

    for (let i = 0; i < free + this.tablePageSize; i++) {
      clones.push(largest.cloneNode(true));
      clones[i].id = `clone${i}`;
      this.vaTableBody.appendChild(clones[i]);
    }

    this.vaTableBody.style.visibility = "hidden";
    setNavigationState(this.vaTableBody, this.tablePageSize, "ALL");
    switchToPage(addPageIndex, "ALL");
    this.vaTableBody.style.height = this.vaTableBody.clientHeight + "px";

    this.vaTableBody.style.visibility = "";
    switchToPage(0, "ALL");
    for (let clone of clones) {
      this.vaTableBody.removeChild(clone);
    }

  },

  setVATableHeader(header) {
    if (header == "") {
      this.vaTable.style.display = "none";
      this.vaTableHeader.innerHTML = header;
    } else {
      this.vaTable.style.display = "";
      let h = header.trim();
      h = h[0].toUpperCase() + h.slice(1);
      this.vaTableHeader.innerHTML = h;
    }
  },

  addRolesTableEntry(metadata) {
    let role = {
      character: {
        name: metadata.characterName,
        image: metadata.characterImage.large,
        url: metadata.characterUrl
      },
      show: {
        title: {
          romaji: metadata.showName
        },
        siteUrl: metadata.showUrl
      }
    };
    addCharacterEntry("roles-table-body", role);
  },

  setRolesTableHeader(header) {
    if (header == "") {
      this.rolesTable.style.display = "none";
      this.rolesTableHeader.innerHTML = header;
    } else {
      this.rolesTable.style.display = "";
      let h = header.trim();
      h = h[0].toUpperCase() + h.slice(1);
      this.rolesTableHeader.innerHTML = h;
    }
  },

  addCharacterEntry(containerId, role, onclick) {

    let character = role.character;
    let show = role.show;

    let container = this.getCharacterContainer(containerId);
    let div = document.createElement("div");
    let thumbnail = document.createElement("div");
    let text = document.createElement("p");
    let characterLink = document.createElement("a");
    let showLink = document.createElement("a");

    thumbnail.style.backgroundImage = `url(${character.image})`;
    thumbnail.classList.add("thumbnail");
    thumbnail.classList.add("clickable");
    if (!onclick) {
      onclick = function() { characterThumbnailOnClick(this); };
    }
    thumbnail.onclick = onclick;
    div.appendChild(thumbnail);

    characterLink.href = character.url;
    characterLink.target = "_blank";
    characterLink.innerHTML = character.name;
    characterLink.style.fontWeight = 'bold';
    text.appendChild(characterLink);

    text.innerHTML += "<br>";

    showLink.href = show.siteUrl;
    showLink.target = "_blank";
    showLink.innerHTML = show.title.romaji;
    text.appendChild(showLink);

    text.classList.add("thumbnail-caption");
    div.appendChild(text);

    div.classList.add("thumbnail-wrapper");
    container.appendChild(div);

    // doesn't work until appended to container for some reason
    container.lastChild.style.width = window.getComputedStyle(thumbnail).width;

  },

  getCharacterContainer(id) {
    switch (id) {
      case "va-popular-characters":
        return this.vaPopularTableBody;
      case "va-uw-characters":
        return this.vaUWTableBody;
      case "va-main-characters":
        return this.vaMainTableBody;
      case "va-support-characters":
        return this.vaSupportTableBody;
      case "roles-table-body":
        return this.rolesTableBody;
      case "character-browse-table-body":
        return this.characterBrowseTableBody;
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

  resetFixedDimensions() {
    this.vaTableBody.style.height = "auto";
  },

  addMediaSearchEntry(media) {

    let container = this.searchTableBody;
    let div = document.createElement("div");
    let thumbnail = document.createElement("div");
    let text = document.createElement("p");
    let link = document.createElement("a");

    thumbnail.style.backgroundImage = `url(${media.coverImage.large})`;
    thumbnail.classList.add("thumbnail");
    thumbnail.classList.add("clickable");
    thumbnail.onclick = function() {
      collectMediaRoles(media);
    };
    div.appendChild(thumbnail);

    link.href = media.siteUrl;
    link.target = "_blank";
    link.innerHTML = media.title.romaji;
    text.appendChild(link);
    div.appendChild(text);

    text.classList.add("thumbnail-caption");
    div.appendChild(text);

    div.classList.add("thumbnail-wrapper");
    container.appendChild(div);

    // doesn't work until appended to container for some reason
    container.lastChild.style.width = window.getComputedStyle(thumbnail).width;

  },

  styleMediaSearchTable(resize) {
    this.styleVATable(resize);
  },

  styleCharacterBrowseTable(resize) {
    this.styleVATable(resize);
  },

  addVALanguageEntry(voiceActor) {

    let wrapper = document.createElement("div");
    let thumbnail = document.createElement("div");
    let text = document.createElement("p");
    let nameLink = document.createElement("a");

    thumbnail.style.backgroundImage = `url(${voiceActor.image.large})`;
    thumbnail.classList.add("thumbnail");
    thumbnail.classList.add("clickable");
    thumbnail.onclick = function() {VADetailsOnClick(voiceActor.id)};

    nameLink.innerHTML = parsedName(voiceActor.name);
    nameLink.href = voiceActor.siteUrl;
    nameLink.target = "_blank";

    text.appendChild(nameLink);
    text.innerHTML += "<br>" + voiceActor.language;
    text.classList.add("thumbnail-caption");

    wrapper.appendChild(thumbnail);
    wrapper.appendChild(text);
    wrapper.classList.add("thumbnail-wrapper");
    this.vaLanguageTableBody.appendChild(wrapper);

    this.vaLanguageTableBody.lastChild.style.width = window.getComputedStyle(thumbnail).width;

  },

  setVaLanguageTableHeader(header) {
    this.setRolesTableHeader(header);
  }

}
