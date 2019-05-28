function setTheme() {
  let body = document.getElementsByTagName("body")[0];
  let defaultTheme = "light";
  let hasStorageAccess = setStorageState();  // handle browser disabling cookies
  if (hasStorageAccess) {
    let themeIsSet = setThemeFromStorage();
    if (!themeIsSet) {
      body.classList.add(defaultTheme);
    }
  }
  else {
    body.classList.add(defaultTheme);
  }
  return hasStorageAccess;
}

function darkModeSwitchOnClick() {
  let body = document.getElementsByTagName("body")[0];
  let _switch = document.getElementById("dark-mode-switch");
  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    _switch.value = "Dark Theme";
    saveTheme("light");
  }
  else {
    body.classList.add("dark");
    _switch.value = "Light Theme";
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
      document.getElementById("dark-mode-switch").value = "Dark Theme";
      break;
    case "dark":
      document.getElementById("dark-mode-switch").value = "Light Theme";
      break;
    default:
  }

  return set;

}
