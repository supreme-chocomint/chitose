function parsedName(rawName) {
  let firstName = rawName.first;
  let lastName = rawName.last;
  if (rawName.first == null) {
    firstName = "";
  }
  if (rawName.last == null) {
    lastName = "";
  }
  let name = firstName + " " + lastName;
  return name.trim();
}

function parsedSeason(quarter, year) {
  return quarter.charAt(0).toUpperCase() + quarter.slice(1).toLowerCase() + " " + year;
}

function parsedSeasonInt(seasonInt) {
  // In format YY[1-4] or Y[1-4] or [1-4] (for year 2000)
  // Will probably break in 2050 due to AniList API's returned value

  let str = seasonInt.toString();
  let quarters = {
    1: "Winter",
    2: "Spring",
    3: "Summer",
    4: "Fall"
  }

  let year = fourDigitYear(str.slice(0, -1));
  let quarter = quarters[str.slice(-1)];
  return parsedSeason(quarter, year);

}

function fourDigitYear(yearString) {
  // e.g. "7" for 2007, "12" for 2012, "" for 2000

  if (yearString.length > 2) {
    return yearString
  }

  if (yearString == ""){
    yearString = "0";
  }

  let yearPartial = parseInt(yearString);
  if (yearPartial < 50) {
    return (2000 + yearPartial).toString();
  } else {
    return (1900 + yearPartial).toString();
  }

}

function sortableSeasonId(naturalSeasonString) {
  // "Winter 2017" return "20171"

  let parts = naturalSeasonString.split(" ");
  let quarters = {
    "winter": 1,
    "spring": 2,
    "summer": 3,
    "fall": 4
  }

  return parts.slice(-1)[0].trim() + quarters[parts[0].trim().toLowerCase()];

}

// Thank you Stack Overflow: https://stackoverflow.com/a/33369954
// Numbers, strings, and booleans return false
function isJson(item) {
  item = typeof item !== "string"
    ? JSON.stringify(item)
    : item;
  try {
      item = JSON.parse(item);
  } catch (e) {
      return false;
  }
  if (typeof item === "object" && item !== null) {
      return true;
  }
  return false;
}
