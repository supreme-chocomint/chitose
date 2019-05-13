function addRolesTableEntry(metadata) {

  let row = document.createElement("tr");
  let showNameCol = document.createElement("td");
  let showName = document.createElement("a");
  let charaNameCol = document.createElement("td");
  let charaName = document.createElement("a");

  showName.innerHTML = metadata.showName;
  showName.href = metadata.showUrl;
  showName.target = "_blank";  // open in new tab
  charaName.innerHTML = metadata.characterName;
  charaName.href = metadata.characterUrl;
  charaName.target = "_blank";  // open in new tab

  showNameCol.appendChild(showName);
  charaNameCol.appendChild(charaName);
  row.appendChild(showNameCol);
  row.appendChild(charaNameCol);
  document.getElementById("roles-table-body").appendChild(row);

}

function clearRolesTable() {
  let table = document.getElementById("roles-table-body");
  table.innerHTML = "";
  table.setAttribute("data-async-count", 0);
}
