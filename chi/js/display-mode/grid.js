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
    this.vaLanguageTable = document.querySelector(".grid.va-language-table");
    this.vaLanguageTableBody = document.querySelector(".grid.va-language-table-body");

    this.vaLanguageTableHeader = document.getElementById("va-language-table-header");

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
    if (onclick) {
      thumbnail.classList.add("clickable");
      thumbnail.onclick = onclick;
    }
    div.appendChild(thumbnail);

    characterLink.href = character.url;
    characterLink.target = "_blank";
    characterLink.innerHTML = character.name;
    characterLink.style.fontWeight = 'bold';
    text.appendChild(characterLink);

    text.innerHTML += "<br>";

    if (show) {
      showLink.href = show.siteUrl;
      showLink.target = "_blank";
      showLink.innerHTML = show.title.romaji;
      text.appendChild(showLink);
    }

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

  setCharacterBrowseHeader(header) {
    this.setVATableHeader(header);
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
    let mediaLink = document.createElement("a");
    let nameLink = document.createElement("a");

    thumbnail.style.backgroundImage = `url(${voiceActor.image.large})`;
    thumbnail.classList.add("thumbnail");
    thumbnail.classList.add("clickable");
    thumbnail.onclick = function() {VADetailsOnClick(voiceActor.id)};

    nameLink.innerHTML = parsedName(voiceActor.name);
    nameLink.style.fontWeight = "bold";
    nameLink.href = voiceActor.siteUrl;
    nameLink.target = "_blank";
    text.appendChild(nameLink);
    text.innerHTML += "<br>";

    if (voiceActor.media) {
      mediaLink.innerHTML = voiceActor.media[0].title.romaji;
      mediaLink.href = voiceActor.media[0].siteUrl;
      mediaLink.target = "_blank";
      text.appendChild(mediaLink);
      text.innerHTML += "<br>";
    }

    text.innerHTML += voiceActor.language;
    text.classList.add("thumbnail-caption");

    wrapper.appendChild(thumbnail);
    wrapper.appendChild(text);
    wrapper.classList.add("thumbnail-wrapper");
    this.vaLanguageTableBody.appendChild(wrapper);

    this.vaLanguageTableBody.lastChild.style.width = window.getComputedStyle(thumbnail).width;

  },

  setVaLanguageTableHeader(header) {
    if (header == "") {
      this.vaLanguageTable.style.display = "none";
      this.vaLanguageTableHeader.innerHTML = header;
    } else {
      this.vaLanguageTable.style.display = "";
      let h = header.trim();
      h = h[0].toUpperCase() + h.slice(1);
      this.vaLanguageTableHeader.innerHTML = h;
    }
  },

  hideEntriesVaLanguageTable() {},

  showEntriesVaLanguageTable() {}

}
