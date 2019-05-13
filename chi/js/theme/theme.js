function darkModeSwitchOnClick() {
  let body = document.getElementsByTagName("body")[0];
  let _switch = document.getElementById("dark-mode-switch");
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    _switch.value = "Turn Dark Mode On";
    saveTheme("light");
  }
  else {
    body.classList.add("dark");
    _switch.value = "Turn Dark Mode Off";
    saveTheme("dark");
  }
}

function fetchTheme() {
  let themeString = localStorage.getItem("theme");
  return themeString;
}

function saveTheme(themeString) {
  localStorage.setItem("theme", themeString);
}

function setThemeFromStorage(defaultTheme) {

  let body = document.getElementsByTagName("body")[0];
  let theme = fetchTheme();
  let set = false;

  if (theme) {
    body.classList.add(theme);
    set = true;
  }

  switch (theme) {
    case "light":
      document.getElementById("dark-mode-switch").value = "Turn Dark Mode On";
      break;
    case "dark":
      document.getElementById("dark-mode-switch").value = "Turn Dark Mode Off";
      break;
    default:
  }

  return set;

}
