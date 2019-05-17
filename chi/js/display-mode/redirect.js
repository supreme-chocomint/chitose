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
  switch (urlFragments[1]) {
    case "grid":
    case "minimalist":
      window.currentDisplay = window.displayModes[urlFragments[1]];
      break;
    default:
      window.location.replace(urlFragments[0] + "?minimalist");
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
