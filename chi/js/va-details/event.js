function VADetailsOnClick(voiceActorId) {

  let mainContainer = document.getElementById("main-container");
  let vaInfoContainer = document.getElementById("va-info-container");
  let vaLeftContainer = document.getElementById("va-left-container");
  let vaRightContainer = document.getElementById("va-right-container");
  let workingId = vaInfoContainer.getAttribute("data-working");

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
    clearVaInfo();
    let roles = window.voiceActors[voiceActorId].roles;

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
