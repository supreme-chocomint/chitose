function isLocked() {
  return document.getElementsByTagName("body")[0].classList.contains("locked");
}

function lock() {
  document.getElementsByTagName("body")[0].classList.add("locked");
  document.getElementById("lock-icon").innerHTML = "🔒";
  document.getElementById("lock-icon").style.display = "";
  document.getElementById("va-table-tools").classList.add("disabled");
}

function unlock() {
  document.getElementsByTagName("body")[0].classList.remove("locked");
  document.getElementById("lock-icon").innerHTML = "";
  document.getElementById("lock-icon").style.display = "none";
  document.getElementById("va-table-tools").classList.remove("disabled");
}

function setStorageState() {
  try {
    localStorage.getItem("following");
    return true;
  }
  catch (AccessDeniedError) {
    warningString = "Cookies and site data permissions must be enabled " +
    "for some site features to work. This includes the ability to follow voice actors."
    setTimeout(function() { window.alert(warningString); }, 1);
    disableFollowing();
    return false;
  }
}
