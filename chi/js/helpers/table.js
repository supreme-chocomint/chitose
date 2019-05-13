function appendEmptyRow(body) {

  let emptyRow = document.createElement("tr");
  let numCol = 0;

  switch (body.id) {

    case "va-table-body":
      numCol = document.getElementById("va-table-head").getElementsByTagName("th").length;
      appendNACells(emptyRow, numCol - 1);
      let emptyCell = document.createElement("td");
      emptyCell.innerHTML = "&nbsp;";
      emptyRow.append(emptyCell);
      break;

    case "roles-table-body":
      numCol = document.getElementById("roles-table-head").getElementsByTagName("th").length;
      appendNACells(emptyRow, numCol - 1);
      break;

    default:
      numCol = 2;
      appendNACells(emptyRow, numCol - 1);

  }

  body.appendChild(emptyRow);

}

// So user is notified if search is done but no results
function addNoResultsIndicator(tableId) {

  let row = document.createElement("tr");
  appendNACells(row, 2);
  document.getElementById(tableId).appendChild(row);

}

function appendNACells(row, numCol) {
  for (let i = 0; i < numCol; i++) {
    let col = document.createElement("td");
    col.innerHTML = "N/A";
    row.appendChild(col);
  }
}
