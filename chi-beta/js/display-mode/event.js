function displayModeSwitchOnClick() {

  let baseUrl = window.location.href.split("#")[0];
  let hash = window.location.hash;
  let urlFragments = baseUrl.split("?");
  switch (urlFragments[1]) {
    case "grid":
      window.location.replace(urlFragments[0] + "?minimalist" + hash);
      break;
    case "minimalist":
      window.location.replace(urlFragments[0] + "?grid" + hash);
      break;
  }

}

function buildDisplayModes() {

  let _switch = document.getElementById("display-mode-switch");

  for (let mode of Object.values(window.displayModes)) {
    mode.init();
  }

  window.currentDisplay.activate();

  switch (window.currentDisplay.name) {
    case "grid":
      _switch.value = "Minimalist Mode";
      break;
    case "minimalist":
      _switch.value = "Grid Mode";
      break;
  }

}
