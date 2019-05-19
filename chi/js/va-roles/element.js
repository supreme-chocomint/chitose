function addRolesTableEntry(metadata) {
  window.currentDisplay.addRolesTableEntry(metadata);
}

function clearRolesTable() {
  let table = window.currentDisplay.rolesTableBody;
  table.innerHTML = "";
  table.setAttribute("data-async-count", 0);
  window.currentDisplay.rolesTable.style.display = "";
  window.currentDisplay.vaLanguageTable.style.display = "none";
}
