function refreshButtonOnClick() {
  if (!isLocked()) {
    lock();
    document.getElementById("search-bar").value = "";
    clearVATable();
    clearRolesTable();
    unclick();
    populateVATableWithSeason();
  }
}

function setNavigationOnClicks() {
  let left = document.getElementById("left-nav");
  let right = document.getElementById("right-nav");
  left.onclick = function () { leftNavOnClick() };
  right.onclick = function () { rightNavOnClick() };
}

function leftNavOnClick() {

  let left = document.getElementById("left-nav");
  let right = document.getElementById("right-nav");
  let pageIndex = window.currentDisplay.vaTableBody.getAttribute("data-pageIndex");
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;

  let x = window.scrollX;
  let y = window.scrollY;
  let height = document.body.clientHeight;
  let yOffset = 0;

  pageIndex = parseInt(pageIndex);

  pageIndex--;
  switchToPage(pageIndex, language);
  window.currentDisplay.vaTableBody.setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == 0){ left.classList.add("inactive"); }
  right.classList.remove("inactive");  // coordinate left and right navs

  yOffset = document.body.clientHeight - height;
  window.scroll(x, y + yOffset); // keep same distance from bottom of page

}

function rightNavOnClick() {

  let right = document.getElementById("right-nav");
  let left = document.getElementById("left-nav");
  let tableBody = window.currentDisplay.vaTableBody;
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;

  let x = window.scrollX;
  let y = window.scrollY;
  let height = document.body.clientHeight;
  let yOffset = 0;

  let pageIndex = tableBody.getAttribute("data-pageIndex");
  let lastPageIndex = tableBody.getAttribute("data-pageCount");
  pageIndex = parseInt(pageIndex);
  lastPageIndex = parseInt(lastPageIndex) - 1; // because count != index

  pageIndex++;
  switchToPage(pageIndex, language);
  window.currentDisplay.vaTableBody.setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == lastPageIndex){ right.classList.add("inactive"); }
  left.classList.remove("inactive");  // coordinate left and right navs

  yOffset = document.body.clientHeight - height;
  window.scroll(x, y + yOffset); // keep same distance from bottom of page

}
