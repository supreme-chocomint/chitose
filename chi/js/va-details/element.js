function buildVaDetailsTab(voiceActorId) {

  let mainContainer = document.getElementById("main-container");
  let vaInfoContainer = document.getElementById("va-info-container");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");
  let toggleCharactersButton = document.getElementById("all-characters-switch");
  let toggleDisplayButton = document.getElementById("display-mode-switch");
  let voiceActor = window.voiceActors[voiceActorId];

  let variables = {
    id: voiceActorId,
    pageNum: 1
  }

  if (isFetchingDetails()) {

    let fetchingId = getFetchingDetailsId();
    if (fetchingId == voiceActorId) {
      mainContainer.style.display = "none";
      vaInfoContainer.style.display = "";
    }
    else if (fetchingId != 0){  // purely defensive check
      window.alert(
        `Currently busy fetching data for ${window.voiceActors[fetchingId].name}.
        View their details page to see progress.`
      );
    }

  }
  else {

    setFetchingDetails(voiceActorId);
    mainContainer.style.display = "none";
    vaInfoContainer.style.display = "";
    toggleCharactersButton.classList.add("disabled");
    toggleDisplayButton.classList.add("disabled");
    clearVaInfo();

    // use cache if it exists, otherwise request data
    if (voiceActor && voiceActor.roles && voiceActor.roles.length != 0) {
      fillVaBasicInfo(window.voiceActors[voiceActorId]);
      fillVaAdvancedInfo(window.voiceActors[voiceActorId]);
      unsetFetchingDetails();
    }
    else {
      document.getElementById("va-info-bio-text").innerHTML = "Getting initial data...";
      makeRequest(getQuery("VA ID"), variables, collectVADetails);
    }

  }

}

function fillVaBasicInfo(vaDetails) {

  let vaHeader = document.getElementById("va-info-name");
  let vaPortrait = document.getElementById("va-info-bio-portrait");
  let vaText = document.getElementById("va-info-bio-text");
  let name = document.createElement("h4");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaSideContainers = document.getElementById("va-side-containers");

  // ----- Staff basic info ----- //

  name.innerHTML = vaDetails.name;
  vaHeader.appendChild(name);

  vaPortrait.style.backgroundImage = `url(${vaDetails.image})`;
  vaPortrait.classList.add("thumbnail");
  vaPortrait.classList.add("action-not-ready");

  // ----- Popular characters ----- //

  let numCharacters = 6;
  addPopularCharacters(vaDetails, numCharacters);

  if (vaDetails.popularRoles.length != 0) {
    for (let role of vaDetails.popularRoles) {
      addCharacterEntry("va-popular-characters", role);
    }
    vaLeftContainer.style.display = "";
  }

  vaSideContainers.style.display = "";  // try to resolve weird display bug

}

function displayPageProgress(page, lastPage) {
  document.getElementById("va-info-bio-text").innerHTML =
    `Getting data: page ${page} of ${lastPage}`;
}

function addNotVaIndicator() {
  document.getElementById("va-info-bio-text").innerHTML =
    "Selected person has no known voice acting roles.";
}

function fillVaAdvancedInfo(vaDetails) {

  let vaPortrait = document.getElementById("va-info-bio-portrait");
  let vaText = document.getElementById("va-info-bio-text");
  let aniListLink = document.createElement("a");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");
  let vaBottomContainer = document.getElementById("va-bottom-container");
  let toggleDisplayButton = document.getElementById("display-mode-switch");

  // ----- Staff stats ----- //

  sortRolesByFavourites(vaDetails.roles);
  calculateStatistics(vaDetails.id);
  vaText.innerHTML = formatStats(vaDetails);

  aniListLink.href = vaDetails.url;
  aniListLink.target = "_blank"; // open in new tab
  aniListLink.innerHTML = "View on AniList";
  vaText.appendChild(aniListLink);

  vaPortrait.onclick = function() { portraitThumbnailOnClick(this); };
  vaPortrait.classList.remove("action-not-ready");

  // ----- Underwatched characters ----- //

  let numCharacters = 6;
  addUwCharacters(vaDetails, numCharacters);

  if (vaDetails.uwRoles.length != 0) {
    for (let uwRole of vaDetails.uwRoles) {
      addCharacterEntry("va-uw-characters", uwRole);
    }
  }

  // ----- All characters ----- //

  for (role of vaDetails.roles) {
    if (role.character.characterRole == "MAIN") {
      addCharacterEntry("va-main-characters", role);
    }
    else {
      addCharacterEntry("va-support-characters", role);
    }
  }

  resizeCharacterContainers(vaDetails);
  toggleDisplayButton.classList.remove("disabled");

}

function resizeCharacterContainers(vaDetails) {

  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");
  let vaBottomContainer = document.getElementById("va-bottom-container");
  let button = document.getElementById("all-characters-switch");

  if (vaDetails.uwRoles.length == 0 && vaDetails.popularRoles.length == 0) {
    vaLeftContainer.style.display = "none";
    vaRightContainer.style.display = "none";
    vaBottomContainer.style.display = "";
    // button already disabled from page load
  }
  else if (vaDetails.uwRoles.length == 0 && vaDetails.popularRoles.length != 0) {
    vaRightContainer.style.display = "none";
    // left container shown by default
    changeSideContainerWidths("natural");
    button.classList.remove("disabled");
  }
  else if (vaDetails.popularRoles.length == 0 && vaDetails.uwRoles.length != 0) {
    vaLeftContainer.style.display = "none";
    vaRightContainer.style.display = "";
    changeSideContainerWidths("natural");
    button.classList.remove("disabled");
  }
  else {
    vaRightContainer.style.display = "";
    button.classList.remove("disabled");
  }

}

function changeSideContainerWidths(widthString) {

  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");

  switch (widthString) {
    case "natural":
      vaLeftContainer.classList.remove("one-half");
      vaLeftContainer.classList.remove("column");
      vaRightContainer.classList.remove("one-half");
      vaRightContainer.classList.remove("column");
      break;
    case "half":
      vaLeftContainer.classList.add("one-half");
      vaLeftContainer.classList.add("column");
      vaRightContainer.classList.add("one-half");
      vaRightContainer.classList.add("column");
      break;
    default:
      break;
  }

}

function formatStats(va) {

  let popular = va.roleMostPopularShow;
  let acclaimed = va.roleHighestRatedShow;

  let string = `
  Popularity: ${va.popularity} favorites<br>
  Number of characters voiced: ${va.rolesCount}<br>

  Most popular show: <a href="${popular.show.siteUrl}" target="_blank">
  ${popular.show.title.romaji}</a>
    (voiced <a href="${popular.character.url}" target="_blank">
    ${popular.character.name}</a>)<br>

  Highest rated show: <a href="${acclaimed.show.siteUrl}" target="_blank">
  ${acclaimed.show.title.romaji}</a>
      (voiced <a href="${acclaimed.character.url}" target="_blank">
      ${acclaimed.character.name}</a>)<br>

  Mean character popularity:
    ${va.avgCharacterPopularity.main} favorites for main characters,
    ${va.avgCharacterPopularity.total} favorites for all characters<br>
  Character spread:
    ${va.characterSpread.MAIN} main,
    ${va.characterSpread.SUPPORTING} supporting
    <br>
  `;

  return string;

}

function addCharacterEntry(containerId, role) {
  window.currentDisplay.addCharacterEntry(containerId, role);
}

function addCharacterTableEntry(tableBodyId, vaDetails) {

  let character = vaDetails.character;
  let show = vaDetails.show;

  let body = document.getElementById(tableBodyId);
  let row = document.createElement("tr");
  let imageCol = document.createElement("td");
  let image = document.createElement("img");
  let textCol = document.createElement("td");
  let characterLink = document.createElement("a");
  let showLink = document.createElement("a");

  image.src = character.image;
  image.alt = character.name;
  imageCol.appendChild(image);
  row.appendChild(imageCol);

  characterLink.href = character.url;
  characterLink.target = "_blank";
  characterLink.innerHTML = character.name;
  showLink.href = show.siteUrl;
  showLink.target = "_blank";
  showLink.innerHTML = show.title.romaji;
  textCol.appendChild(characterLink);
  textCol.innerHTML += "<br>";
  textCol.appendChild(showLink);
  row.appendChild(textCol);

  body.appendChild(row);

}

function clearVaInfo() {

  document.getElementById("va-info-name").innerHTML = "";
  document.getElementById("va-info-bio-portrait").style.backgroundImage = "";
  document.getElementById("va-info-bio-portrait").classList.remove("thumbnail");
  document.getElementById("va-info-bio-text").innerHTML = "";
  document.getElementById("va-left-container").style.display = "none";
  document.getElementById("va-right-container").style.display = "none";
  document.getElementById("va-bottom-container").style.display = "none";
  window.currentDisplay.clearSideContainers();
  window.currentDisplay.clearBottomContainer();

  changeSideContainerWidths("half");
  changeSideContainerWidths("half");

}
