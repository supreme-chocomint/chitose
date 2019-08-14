// ==UserScript==
// @name        Site Integration for Chitose
// @description Adds quick links to https://themightyhotel.bitbucket.io/chi on MAL, AniList, ANN, and AP.
// @version     1.0.0
// @include     https://myanimelist.net/people/*
// @include     https://myanimelist.net/people.php?id=*
// @include     https://anilist.co/staff/*
// @include     https://www.animenewsnetwork.com/encyclopedia/people.php?id=*
// @include     https://www.anime-planet.com/people/*
// @grant       GM_addStyle
// @run-at      document-idle
// ==/UserScript==

var url = window.location.href

if (url.includes("myanimelist")) doMAL()
else if (url.includes("anilist")) doAniList()
else if (url.includes("animenewsnetwork")) doANN()
else if (url.includes("anime-planet")) doAP()

function doMAL() {
    let name = document.querySelector(".h1").textContent
    appendSearchLink(name, document.querySelector("#profileRows"))
}

function doAniList() {
    // Get numbers from URL, which is the ID used on chitose.
    let id = url.match(/(\d+)/)[1]

    // AniList has a loading screen, so need to wait for it.
    // https://stackoverflow.com/a/16726669 
    let observer = new MutationObserver(function(mutations, observer) {
        let done = false
        for (let mutation of mutations) {

            if (!mutation.addedNodes) return
            let header = document.querySelector(".header")
            let name = document.querySelector("h1").textContent
            if (header == null || name == null) return

            appendSearchLink(name, header.querySelector(".content"))
            appendProfileLink(id, header.querySelector(".content"))
            GM_addStyle (`
                .chitose_link {
                    font-size: 1.4rem;
                    line-height: 1.5;
                }
            `)
            done = true
            break
        }
        if (done) this.disconnect()
    })
    observer.observe(document.body, {childList: true, subtree: true})
}

function doANN() {
    let name = document.querySelector("#page_header").textContent
    let container = document.createElement("span")
    container.innerHTML = "<br />"
    appendSearchLink(name, container)
    document.querySelector("#page-title").appendChild(container)
}

function doAP() {
    var name = document.querySelector("[itemprop=name]").textContent
    var container = document.createElement("p")
    appendSearchLink(name, container)
    document.querySelector("[itemprop=description]").appendChild(container)
}

function appendSearchLink(searchReference, container) {
    let searchLink = document.createElement("a")
    searchLink.classList.add("chitose_link")
    searchLink.innerHTML = "Search on Chitose<br />"
    searchLink.href = "file:///E:/Software/BitbucketWebsite/chi/index.html#" + searchReference
    container.appendChild(searchLink)
}

function appendProfileLink(id, container) {
    let profileLink = document.createElement("a")
    profileLink.classList.add("chitose_link")
    profileLink.innerHTML = "View Profile on Chitose<br />"
    profileLink.href = "file:///E:/Software/BitbucketWebsite/chi/index.html#" + id
    container.appendChild(profileLink)
}