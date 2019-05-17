function setOnHashChange() {
  window.onhashchange = function() {
    let redirect = tabRedirect();
    if ( redirect == "main" && !mainTabLoaded() ) {
      window.onload();  // only call onload() when explicitly switching tabs
      setMainTabLoaded(true);
    }
  };
}

function setMainTabLoaded(bool) {
  document.getElementById("main-container").setAttribute("data-loaded", bool);
}

function mainTabLoaded() {
  let val = document.getElementById("main-container").getAttribute("data-loaded");
  if (val == "false") {
    return false;
  }
  else {
    return true;
  }
}

function tabRedirect(){

  let hash = window.location.hash.split("#").join("");
  let redirect = "";

  if (isNaN(parseInt(hash))) {
    showMainTab();
    redirect = "main";
  }
  else {
    buildVaDetailsTab(parseInt(hash));
    redirect = "va-details";
  }

  return redirect;

}
