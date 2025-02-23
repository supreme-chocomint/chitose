# chi歳

Pronounced "chitose", and named after Karasuma Chitose.

![Karasuma Chitose, from Girlish Number, episode 5](assets/chitose.jpg)

## Overview

A web app/site for searching and following voice actors (VAs). Main features include:
- Browse VAs by season (e.g. Winter 2017), and see all their roles for a season
- Search for a VA's roles by their name, a character's name, or an anime's title
- Automatic highlighting of popular/under-watched roles, as well as sortable list of all roles
- Supports Japanese, English, etc VAs
- VA following/tracking, as well as import/export of those follows
- Dark and light theme
- Minimalist (i.e. mostly text) and grid-based (i.e. has more pictures) modes
- Mobile-friendly, with "Add to Home Screen" support (tested on Android)
- Integrates with MyAnimeList, AniList, Anime-Planet, and Anime News Network via the [integration userscript](https://github.com/supreme-chocomint/chitose-integration)

App originally hosted on Bitbucket and now lives on Github. Uses data from AniList, and CSS from [the Skeleton boilerplate](http://getskeleton.com).

## Code Structure

All JavaScript is organized into features, where each directory holds *all* the code required to implement a specific feature (except for the `main` and `helpers` directories). This includes everything from DOM manipulation to the AniList response handling. In hindsight, this probably wasn't the best way to organize it.

- `main`: stuff that has to do with the entire app in general, including locked-state management (i.e. when user can't do anything because stuff is loading) and page redirection
- `helpers`: universal string parsing and table helpers, as well as string constants
- `display-mode`: minimalist and grid modes
- `follow`: voice actor following/tracking
- `search`: voice actor, character, and anime searching, as well as navigation through partial search results
- `va-directory`: listing of all voice actors for a season
- `va-roles`: listing of all roles in a season for one voice actor
- `va-details`: voice actor details page (which has statistics and all works)
- `tab`: stuff related to switching between the main page and the voice actor details page
- `theme`: dark and light theme

## License

MIT.