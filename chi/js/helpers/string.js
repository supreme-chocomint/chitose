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
  <b>Examples:</b><br>
  <b>Search by show:</b> "Humanity has Declined", "Jinrui wa Suitai Shimashita",
  or "人類は衰退しました"<br>
  <b>Search by character:</b> "Phos", "Phos from Land of the Lustrous"
  (character_name from show_name), "Phos, 宝石の国" (character_name, show_name),
  or variants. Languages can be mixed-and-matched.
  </p>
  `;
  return string;
}

function getVaFragmentationErrorString() {
  return "Too many requests sent to AniList, due to the voice actor's data " +
  "being too fragmented (often the case with dub actors with lots of work done). " +
  "As a result, character data may be noticeably incomplete and biased " +
  "towards popular characters/shows.";
}

function getVaFragmentationNoticeString() {
  return "<b>Warning</b>: couldn't get all characters, due to high AniList data fragmentation.";
}
