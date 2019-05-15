function addRolesTableEntry(metadata) {
  window.currentDisplay.addRolesTableEntry(metadata);
}

function clearRolesTable() {
  let table = document.getElementById("roles-table-body");
  table.innerHTML = "";
  table.setAttribute("data-async-count", 0);
}
