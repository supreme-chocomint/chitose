function displayModeSwitchOnClick() {

  let baseUrl = window.location.href.split("#")[0];
  let hash = window.location.hash;
  let urlFragments = baseUrl.split("?");

  switch (window.currentDisplay.name) {
    case "grid":
      saveDisplayMode("minimalist");
      break;
    case "minimalist":
      saveDisplayMode("grid");
      break;
  }

  window.location.reload()

}

function buildDisplayModes() {

  let _switch = document.getElementById("display-mode-switch");

  for (let mode of Object.values(window.displayModes)) {
    mode.init();
  }

  switch (window.currentDisplay.name) {
    case "grid":
      _switch.value = "Minimalist Mode";
      break;
    case "minimalist":
      _switch.value = "Grid Mode";
      break;
  }

  window.currentDisplay.activate();

}

function setDisplayMode() {
  let dmString = fetchDisplayMode();
  switch (dmString) {
    case "grid":
      window.currentDisplay = window.displayModes["grid"];
      break;
    default:
      window.currentDisplay = window.displayModes["minimalist"];
      break;
  }
  saveDisplayMode(window.currentDisplay.name);
}

function fetchDisplayMode() {
  try {
    let dmString = localStorage.getItem("display_mode");
    return dmString;
  }
  catch (AccessDeniedError) {
    return "minimalist";
  }
}

function saveDisplayMode(name) {
  try {
    localStorage.setItem("display_mode", name);
  }
  catch (AccessDeniedError) {}
}
