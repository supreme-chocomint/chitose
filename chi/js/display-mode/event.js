function displayModeSwitchOnClick() {

  let _switch = document.getElementById("display-mode-switch");
  let voiceActorId = document.getElementById("va-info-container").getAttribute("data-va-id");

  let quarterElement = document.getElementById("quarter-picker");
  let quarter = quarterElement.options[quarterElement.selectedIndex].value.toUpperCase();
  let year = document.getElementById("year-picker").value;

  lock();
  setFetchingDetails(voiceActorId);
  _switch.classList.add("disabled");

  clearVATable();
  clearRolesTable();
  clearVaInfo();
  unclick();

  switch (window.currentDisplay.name) {
    case "minimalist":
      window.currentDisplay.deactivate();
      window.currentDisplay = window.displayModes["grid"];
      window.currentDisplay.activate();
      _switch.value = "Switch to Minimalist Mode";
      break;
    case "grid":
      window.currentDisplay.deactivate();
      window.currentDisplay = window.displayModes["minimalist"];
      window.currentDisplay.activate();
      _switch.value = "Switch to Grid Mode";
      break;
  }

  clearSeasonSpecificData();
  populateVATableWithSeasonCache();

  // if first visit or refreshed
  if (voiceActorId != undefined && voiceActorId != 0) {
    fillVaBasicInfo(window.voiceActors[voiceActorId]);
    fillVaAdvancedInfo(window.voiceActors[voiceActorId]);
  }

  unlock();
  unsetFetchingDetails();
  _switch.classList.remove("disabled");

}
