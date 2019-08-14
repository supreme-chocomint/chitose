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
    document.title = document.mainTitle;
    redirect = "main";
  }
  else {
    if ( isFetchingDetails() && (getFetchingDetailsId() != hash) ) {
      window.location.hash = "";
      window.alert(
        `Currently busy fetching data for ${window.voiceActors[getFetchingDetailsId()].name}.
        View their details page to see progress.`
      );
      showMainTab();
      return "main";
    }
    else {
      buildVaDetailsTab(hash);
      redirect = "va-details";
    }
  }

  return redirect;

}
