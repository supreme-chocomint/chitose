// Runs immediately

function main() {

  let minimalist = Object.create(Minimalist);
  let grid = Object.create(Grid);

  window.displayModes = {
    "minimalist": minimalist,
    "grid": grid
  }
  window.currentDisplay = null;

  let baseUrl = window.location.href.split("#")[0];
  let urlFragments = baseUrl.split("?");
  /* If display mode is in URL, set it as preference. */
  switch (urlFragments[1]) {
    case "grid":
    case "minimalist":
      window.currentDisplay = window.displayModes[urlFragments[1]];
      saveDisplayMode(window.currentDisplay.name)
      window.location.replace(urlFragments[0] + window.location.hash)
      break;
    default:
      /* Use preferences or default if none exist */
      setDisplayMode();
      break;
  }

  window.mediaFormats = ["TV", "ONA", "TV_SHORT"];
  window.voiceActors = {};
  window.seasonalRolesCounter = {};  // must be preserved across requests
  window.seasonRawData = {};
  window.seasonRawDataIndex = 0;

  document.baseTitle = document.title.split(" - ")[0].trim();
  document.mainTitle = document.title;

  console.log("Katta na! GAHAHA");
  console.log("---");

}

main();
