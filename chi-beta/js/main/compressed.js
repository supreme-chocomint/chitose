function getQuery(a){return"VA SEARCH"===a?`
  query ($page: Int, $perPage: Int, $search:String) {

    Page (page: $page, perPage: $perPage) {

      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

      staff (search: $search) {
        id
        name {
          first
          last
        }
        siteUrl
        language
        image {
          large
        }
        characters (perPage: 1) {
          nodes {
            id
          }
        }
      }
    }

  }
  `:"ANIME SEARCH"===a?`
  query ($page: Int, $perPage: Int, $search:String) {

    Page (page: $page, perPage: $perPage) {

      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

      media (search: $search, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        siteUrl
        isAdult
        coverImage {
          large
        }
        characters (sort: FAVOURITES_DESC) {
          edges {
            id
            voiceActors {
              id
              name {
                first
                last
                native
              }
              language
              siteUrl
              image {
                large
              }
            }
            node {
              id
              siteUrl
              name {
                first
                last
                native
              }
              image {
                large
              }
            }
          }
        }
      }
    }

  }
  `:"ANIME SEARCH CHARACTER ID"===a?`
  query ($page: Int, $perPage: Int, $search:String) {

    Page (page: $page, perPage: $perPage) {

      media (search: $search, type: ANIME) {
        characters (sort: FAVOURITES_DESC) {
          edges {
            node {
              id
            }
          }
        }
      }
    }

  }
  `:"CHARACTER SEARCH"===a?`
  query ($page: Int, $perPage: Int, $search:String) {

    Page (page: $page, perPage: $perPage) {

      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

      characters (search: $search) {
        id
        name {
          first
          last
        }
        siteUrl
        image {
          large
        }
        media (sort: POPULARITY_DESC) {
        	edges {
            node {
              id
              title {
                romaji
                english
                native
                userPreferred
              }
              isAdult
              siteUrl
              type
              popularity
            }
            voiceActors {
              id
              name {
                first
                last
                native
              }
              image {
                large
              }
              siteUrl
              language
            }
          }
        }
      }
    }
  }
  `:"VA ID"===a?`
  query ($id: Int, $pageNum: Int) {
    Staff (id: $id) {`+`
    id
    name {
      first
      last
      native
    }
    language
    siteUrl
    image {
      large
    }
    favourites
    characters (sort: FAVOURITES_DESC, page: $pageNum) {
      pageInfo {
        hasNextPage
        currentPage
        lastPage
      }
      edges {
        role
        id
        media {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          popularity
          meanScore
          siteUrl
        }
        node {
          id
          name {
            first
            last
            native
          }
          favourites
          image {
            large
          }
          siteUrl
        }
      }
    }
  `+`}
  }
  `:"CHARACTER ID"===a?`
  query ($id: Int) {
    Character (id: $id) {
      id
      name {
        first
        last
        native
      }
      image {
        large
      }
      favourites
      siteUrl
      media (sort: POPULARITY_DESC, perPage: 1) {
        edges {
          characterRole
        }
        nodes {
          id
          title {
            romaji
            english
            native
            userPreferred
          }
          popularity
          meanScore
          siteUrl
        }
      }
    }
  }
  `:"\n  query ($season: MediaSeason!, $seasonYear: Int!, $page: Int, $perPage: Int, $format: MediaFormat!) {\n    Page(page: $page, perPage: $perPage) {\n      pageInfo {\n        total\n        currentPage\n        lastPage\n        hasNextPage\n        perPage\n      }\n      media(season: $season, seasonYear: $seasonYear, format: $format, type: ANIME, sort: POPULARITY_DESC) {\n        id\n        title {\n          romaji\n        }\n        coverImage {\n          medium\n        }\n        siteUrl\n        characters {\n          edges {\n            id\n            role\n            voiceActors { \n    id\n    name {\n      first\n      last\n    }\n    siteUrl\n    language\n    image {\n      large\n    }\n  }\n            node {\n              id\n              name {\n                first\n                last\n                native\n              }\n              image {\n                large\n              }\n              siteUrl\n            }\n          }\n        }\n      }\n    }\n  }\n  "}function makeRequest(a,b,c,d){let e={method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({query:a,variables:b})};d==null&&(d=handleError),fetch("https://graphql.anilist.co",e).then(handleResponse).then(function(a){c(a)}).catch(d)}function handleResponse(a){return a.json().then(function(b){return a.ok?b:Promise.reject(b)})}function handleError(a){try{let b=a.errors[0].status,c=a.errors[0].message;429==b?window.location.href="429.html#"+JSON.stringify(a):404==b?window.location.href="404.html#"+JSON.stringify(a):alert(`AniList error - status: ${b}, message: ${c}. See console for details.`)}catch(a){alert("Error. See console for more details.")}console.error(a)}function setDescription(){let a=document.getElementById("description-text");a.innerHTML=getDescriptionString()}function showMainTab(){let a=document.getElementById("main-container"),b=document.getElementById("va-info-container");a.style.display="",b.style.display="none"}window.onload=function(){buildDisplayModes();let a=document.getElementsByTagName("body")[0],b="light",c=setStorageState();if(c){let c=setThemeFromStorage();c||a.classList.add(b)}else a.classList.add(b);setOnEvents();let d=tabRedirect();"main"===d?(setMainTabLoaded(!0),buildMainTab(c)):"va-details"===d?setMainTabLoaded(!1):void 0};function setOnEvents(){setOnClicks(),setOnKeyPresses(),setOnHashChange(),window.onresize=function(){window.currentDisplay.resetFixedDimensions()}}function buildMainTab(a){lock(),setDescription(),buildSeasonPickers(),buildSearchPicker(),buildLanguageFilter(),clearSearchBar(),clearTransferBox(),clearVATable(),setSeason("",""),unclick(),populateVATableWithSeason(),a&&(lock(),populateFollowTable())}function setOnClicks(){let a=document.getElementById("search-button"),b=document.getElementById("refresh-button"),c=document.getElementById("display-mode-switch"),d=document.getElementById("dark-mode-switch"),e=document.getElementById("left-table-switch"),f=document.getElementById("import-button"),g=document.getElementById("export-button"),h=document.getElementById("return-button"),i=document.getElementById("all-characters-switch");a.onclick=function(){searchButtonOnClick()},b.onclick=function(){refreshButtonOnClick()},c.onclick=function(){displayModeSwitchOnClick()},d.onclick=function(){darkModeSwitchOnClick()},e.onclick=function(){leftTableSwitchOnClick()},f.onclick=function(){importButtonOnClick()},g.onclick=function(){exportButtonOnClick()},h.onclick=function(){returnButtonOnClick()},i.onclick=function(){allCharactersSwitchOnClick()},setNavigationOnClicks()}function setOnKeyPresses(){let a=document.getElementById("search-bar");a.addEventListener("keyup",function(a){a.keyCode==13&&searchButtonOnClick()})}function leftTableSwitchOnClick(){let a=window.currentDisplay.vaTable,b=window.currentDisplay.followTable,c=window.currentDisplay.followTableBody,d=document.getElementById("search-bar"),e=document.getElementById("search-picker"),f=document.getElementById("search-button"),g=document.getElementById("refresh-button"),h=document.getElementById("navigation"),i=document.getElementById("transfer"),j=a.getAttribute("data-state");"none"==a.style.display?("season"==j&&(changed=c.getAttribute("data-changed"),"true"==changed&&(clearVATable(),populateVATableWithSeason(),c.setAttribute("data-changed","false"))),a.style.display="",b.style.display="none",d.disabled=!1,e.disabled=!1,f.disabled=!1,g.disabled=!1,h.style.display="",i.style.display="none"):(a.style.display="none",b.style.display="",d.disabled=!0,e.disabled=!0,f.disabled=!0,g.disabled=!0,h.style.display="none",i.style.display="")}function refreshButtonOnClick(){isLocked()||(lock(),document.getElementById("search-bar").value="",clearVATable(),clearRolesTable(),unclick(),populateVATableWithSeason())}function main(){let a=Object.create(Minimalist),b=Object.create(Grid);window.displayModes={minimalist:a,grid:b},window.currentDisplay=null;let c=window.location.href.split("#")[0],d=c.split("?");switch(d[1]){case"grid":case"minimalist":window.currentDisplay=window.displayModes[d[1]];break;default:window.location.replace(d[0]+"?minimalist");}window.mediaFormats=["TV","ONA","TV_SHORT"],window.voiceActors={},window.seasonalRolesCounter={},window.seasonRawData={},window.seasonRawDataIndex=0,document.baseTitle=document.title.split(" - ")[0].trim(),document.mainTitle=document.title,console.log("Katta na! GAHAHA"),console.log("---")}main();function isLocked(){return document.getElementsByTagName("body")[0].classList.contains("locked")}function lock(){document.getElementsByTagName("body")[0].classList.add("locked"),document.getElementById("lock-icon").innerHTML="\uD83D\uDD12",document.getElementById("lock-icon").style.display=""}function unlock(){document.getElementsByTagName("body")[0].classList.remove("locked"),document.getElementById("lock-icon").innerHTML="",document.getElementById("lock-icon").style.display="none"}function setStorageState(){try{return localStorage.getItem("following"),!0}catch(a){return warningString="Cookies and site data permissions must be enabled for some site features to work. This includes the ability to follow voice actors.",setTimeout(function(){window.alert(warningString)},1),disableFollowing(),!1}}