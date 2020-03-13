function VADetailsOnClick(voiceActorId) {
  window.location.hash = voiceActorId;
}

function returnButtonOnClick() {
  window.location.hash = "";
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

function portraitThumbnailOnClick(element) {
  let text = element.parentNode.children[1].children[0];
  text.lastChild.click();
}

function characterThumbnailOnClick(element) {
  element.nextSibling.firstChild.click();
}

function characterSectionLinkOnClick(e) {
  let jumpToId = e.target.getAttribute("data-destination");
  document.getElementById(jumpToId).scrollIntoView(true);
}
