// Functions for sending queries to and receiving responses from AniList

function getQuery(type) {

  let staffSearchQuery = `
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
      }
    }

  }
  `;
  let seasonShowListQuery = `
  query ($season: MediaSeason!, $seasonYear: Int!, $page: Int, $perPage: Int) {

    Page (page: $page, perPage: $perPage) {

      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }

      media (season: $season, seasonYear: $seasonYear, format: TV, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          english
          romaji
        }
        startDate {
          year
          month
          day
        }
      }

    }
  }
  `;
  let fullSeasonDataQuery = `
  query ($season: MediaSeason!, $seasonYear: Int!, $page: Int, $perPage: Int, $format: MediaFormat!) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(season: $season, seasonYear: $seasonYear, format: $format, type: ANIME, sort: POPULARITY_DESC) {
        id
        title {
          romaji
        }
        coverImage {
          medium
        }
        siteUrl
        characters {
          edges {
            id
            role
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
                medium
              }
            }
            node {
              id
              name {
                first
                last
                native
              }
              image {
                medium
              }
              siteUrl
            }
          }
        }
      }
    }
  }
  `;
  let staffIdQuery = `
  query ($id: Int) {
    Staff (id: $id) {
      id
      name {
        first
        last
        native
      }
      language
      siteUrl
      image {
        medium
      }
    }
  }
  `

  if (type === "VA SEARCH") {
    return staffSearchQuery;
  } else if (type === "VA ID") {
    return staffIdQuery;
  } else {
    return fullSeasonDataQuery;
  };

}

function makeRequest(query, variables, callback) {

  let url = 'https://graphql.anilist.co',
      options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              query: query,
              variables: variables
          })
      };

  fetch(url, options).then(handleResponse)
                     .then(function(data){ callback(data) })
                     .catch(handleError);
}

function handleResponse(response) {
  return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
  });
}

function handleError(error) {
  alert('Error, check console');
  console.error(error);
}
