function fillVaBasicInfo(vaDetails) {

  // ----- Staff Data ----- //

  let vaHeader = document.getElementById("va-info-name");
  let vaPortrait = document.getElementById("va-info-bio-portrait");
  let vaText = document.getElementById("va-info-bio-text");
  let name = document.createElement("h4");
  let vaLeftContainer = document.getElementById("va-left-container");

  name.innerHTML = vaDetails.name;
  vaHeader.appendChild(name);

  vaPortrait.style.backgroundImage = `url(${vaDetails.image})`;
  vaPortrait.classList.add("thumbnail");

  // ----- Character Data ----- //

  sortRolesByFavourites(vaDetails.roles);

  let n = 0;
  for (let role of vaDetails.roles) {
    addCharacterEntry("va-popular-characters", role);
    n++;
    if (n == 6) {
      break;
    }
  }

  styleCharacterEntries();
  vaLeftContainer.style.display = "";

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

  let vaText = document.getElementById("va-info-bio-text");
  let aniListLink = document.createElement("a");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");

  calculateStatistics(vaDetails.id);
  vaText.innerHTML = formatStats(vaDetails);

  aniListLink.href = vaDetails.url;
  aniListLink.target = "_blank"; // open in new tab
  aniListLink.innerHTML = "View on AniList";
  vaText.appendChild(aniListLink);

  let numCharacters = 6;
  addUwCharacters(vaDetails, numCharacters);

  if (vaDetails.uwRoles.length == 0) {
    vaRightContainer.style.display = "none";
    vaLeftContainer.classList.add("full-container");
  }
  else {

    for (let uwRole of vaDetails.uwRoles) {
      addCharacterEntry("va-uw-characters", uwRole);
    }

    styleCharacterEntries();
    vaRightContainer.style.display = "";

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
  Character significance spread:
    ${va.characterSpread.MAIN} main,
    ${va.characterSpread.SUPPORTING} supporting
    <br>
  `;

  return string;

}

function addCharacterEntry(containerId, role) {

  let character = role.character;
  let show = role.show;

  let container = document.getElementById(containerId);
  let div = document.createElement("div");
  let thumbnail = document.createElement("div");
  let text = document.createElement("p");
  let characterLink = document.createElement("a");
  let showLink = document.createElement("a");

  thumbnail.style.backgroundImage = `url(${character.image})`;
  thumbnail.classList.add("thumbnail");
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

}

function styleCharacterEntries() {

  // --- Make captions same width as thumbnails --- //

  let thumbnail = document.querySelector(".thumbnail");
  let style = window.getComputedStyle(thumbnail);

  let captions = document.getElementsByClassName("thumbnail-caption");
  for (let caption of captions) {
    caption.style.width = style.width;
  }

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
  document.getElementById("va-popular-characters").innerHTML = "";
  document.getElementById("va-uw-characters").innerHTML = "";
  document.getElementById("va-left-container").style.display = "none";
  document.getElementById("va-left-container").classList.remove("full-container");
  document.getElementById("va-right-container").style.display = "none";
}
