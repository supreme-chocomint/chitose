// Functions that return long hard-coded strings

function getDescriptionString() {
  let aniListLink = "<a href='https://anilist.co/' target = '_blank'>AniList</a>"
  let string = "Find out what your favorite voice actors are " +
    "up to this season (or any season) !<br> Browse a season by number " +
    "of roles, or search by name, and click on the one you want to see from the " +
    "left-hand / top table.<br> The right-hand / bottom table will generate " +
    "all TV shows, TV shorts, and ONAs they're involved in.<br>" +
    "Follow a voice actor by clicking the star icon, and view all follows " +
    "by clicking the 'toggle following' button.<br><br>" +
    "Things not loading? Double-check that " + aniListLink +
    " (the data provider) is online."
  return string;
}

function getExplainString() {
  let string = `
  <p>
  Search by show examples:<br>
  "Humanity has Declined", "Jinrui wa Suitai Shimashita", or "人類は衰退しました"
  </p>
  <p>
  Search by character examples:<br>
  "Phos", "Phos from Land of the Lustrous" (CHARACTER_NAME from SHOW_NAME),
  "Phos, 宝石の国" (CHARACTER_NAME, SHOW_NAME), or variants
  </p>
  `;
  return string;
}
