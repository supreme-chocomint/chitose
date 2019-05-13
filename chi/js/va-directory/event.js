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
  let pageIndex = document.getElementById("va-table-body").getAttribute("data-pageIndex");
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;
  pageIndex = parseInt(pageIndex);

  pageIndex--;
  switchToPage(pageIndex, language);
  document.getElementById("va-table-body").setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == 0){ left.classList.add("inactive"); }
  right.classList.remove("inactive");  // coordinate left and right navs

}

function rightNavOnClick() {

  let right = document.getElementById("right-nav");
  let left = document.getElementById("left-nav");
  let tableBody = document.getElementById("va-table-body");
  let filter = document.getElementById("language-filter");
  let language = filter.options[filter.selectedIndex].value;

  let pageIndex = tableBody.getAttribute("data-pageIndex");
  let lastPageIndex = tableBody.getAttribute("data-pageCount");
  pageIndex = parseInt(pageIndex);
  lastPageIndex = parseInt(lastPageIndex) - 1; // because count != index

  pageIndex++;
  switchToPage(pageIndex, language);
  document.getElementById("va-table-body").setAttribute("data-pageIndex", pageIndex);

  if (pageIndex == lastPageIndex){ right.classList.add("inactive"); }
  left.classList.remove("inactive");  // coordinate left and right navs

}
