// Runs immediately

let minimalist = Object.create(Minimalist);
let grid = Object.create(Grid);

window.displayModes = {
  "minimalist": minimalist,
  "grid": grid
}
window.currentDisplay = null;

let urlFragments = window.location.href.split("?");
switch (urlFragments[1]) {
  case "grid":
  case "minimalist":
    window.currentDisplay = window.displayModes[urlFragments[1]];
    break;
  default:
    window.location.replace(urlFragments[0] + "?minimalist");
    break;
}
