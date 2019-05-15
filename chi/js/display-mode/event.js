function displayModeSwitchOnClick() {

  let urlFragments = window.location.href.split("?");
  switch (urlFragments[1]) {
    case "grid":
      window.location.replace(urlFragments[0] + "?minimalist");
      break;
    case "minimalist":
      window.location.replace(urlFragments[0] + "?grid");
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
