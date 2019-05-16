function buildSeasonPickers() {
  buildYearPicker();
  buildQuarterPicker();
}

function buildYearPicker() {
  let yearPicker = document.getElementById("year-picker");
  for (let year = 1950; year <= 2020; year++) {
    let option = document.createElement("option");
    option.value = year;
    option.innerHTML = year;
    yearPicker.appendChild(option);
  }
  yearPicker.onchange = function() { onSeasonChange(); };
}

function buildQuarterPicker() {
  let quarterPicker = document.getElementById("quarter-picker");
  let quarters = ["WINTER", "SPRING", "SUMMER", "FALL"]
  for (let quarter of quarters) {
    let option = document.createElement("option");
    option.value = quarter;
    option.innerHTML = quarter;
    quarterPicker.appendChild(option);
  }
  quarterPicker.onchange = function() { onSeasonChange(); };
}

function setSeason(year, quarter) {
  if (!year || !quarter) {
    let quarters = {0: "WINTER", 1: "SPRING", 2: "SUMMER", 3:"FALL"};
    let quarterIndex = Math.floor(new Date().getMonth() / 3);
    year = new Date().getFullYear();
    quarter = quarters[quarterIndex];
  }
  document.getElementById("year-picker").value = year;
  document.getElementById("quarter-picker").value = quarter;
}

function buildLanguageFilter() {
  updateLanguageFilter("ALL");
  document.getElementById("language-filter").onchange =
    function() { onLanguageChange(); };
}

function updateLanguageFilter(language) {
  let filter = document.getElementById("language-filter");
  for (let option of filter.children) {
    if (option.value == language) {
      return;
    }
  }
  let option = document.createElement("option");
  option.value = language;
  option.innerHTML = language;
  filter.appendChild(option);
}
