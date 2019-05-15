function setDisplayModeFromStorage() {

  let displayName = localStorage.getItem("display");
  if (displayName) {
    window.currentDisplay = window.displayModes[displayName];
  }

  // if display not found
  if (!(window.currentDisplay)) {
    let keys = Object.keys(window.displayModes);
    window.currentDisplay = window.displayModes[keys[0]];
  }

}
