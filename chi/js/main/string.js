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
