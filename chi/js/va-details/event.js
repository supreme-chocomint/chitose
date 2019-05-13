function VADetailsOnClick(voiceActorId) {

  let mainContainer = document.getElementById("main-container");
  let vaInfoContainer = document.getElementById("va-info-container");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");
  let toggleCharactersButton = document.getElementById("all-characters-switch");
  let workingId = vaInfoContainer.getAttribute("data-working");
  let roles = window.voiceActors[voiceActorId].roles;

  let variables = {
    id: voiceActorId,
    pageNum: 1
  }

  if (isLocked()) {

    if (workingId == voiceActorId) {
      mainContainer.style.display = "none";
      vaInfoContainer.style.display = "";
    }

    else if (workingId != undefined && workingId != 0){  // purely defensive check
      window.alert(
        `Currently busy fetching data for ${window.voiceActors[workingId].name}.
        View their details page to see progress.`
      );
    }

  }
  else {

    lock(voiceActorId);
    mainContainer.style.display = "none";
    vaInfoContainer.style.display = "";
    toggleCharactersButton.classList.add("disabled");
    clearVaInfo();

    // use cache if it exists, otherwise request data
    if (roles && roles.length != 0) {
      fillVaBasicInfo(window.voiceActors[voiceActorId]);
      fillVaAdvancedInfo(window.voiceActors[voiceActorId]);
      unlock();
    }
    else {
      document.getElementById("va-info-bio-text").innerHTML = "Getting initial data...";
      makeRequest(getQuery("VA ID"), variables, collectVADetails);
    }

  }

}

function returnButtonOnClick() {

  let mainContainer = document.getElementById("main-container");
  let vaInfoContainer = document.getElementById("va-info-container");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");

  mainContainer.style.display = "";
  vaInfoContainer.style.display = "none";

}

function allCharactersSwitchOnClick() {

  let vaSideContainers = document.getElementById("va-side-containers");
  let vaBottomContainer = document.getElementById("va-bottom-container");

  if (vaBottomContainer.style.display == "none") {
    vaBottomContainer.style.display = "";
    vaSideContainers.style.display = "none";
  }
  else {
    vaSideContainers.style.display = "";
    vaBottomContainer.style.display = "none";
  }

}
