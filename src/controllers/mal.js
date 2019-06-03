const helpers = require("../helpers");
const cheerio = require("cheerio");
const scraper = require("mal-scraper");
const fetch = require("node-fetch");
const { text, flatten } = require("../utils");
const { Router } = require('express');

const router = new Router();

const ANIME_COUNT_PER_REQUEST = 300;
const MAX_ANIMES = 900;

const DEFAULT_MAL_PARAMS = {
    after: 0,
    type: "anime"
};

/**
 * Calculates the amount of requests required to
 * fetch a user's entire collection
 * @param {number} totalAnimes
 */
const requiredRequestCount = totalAnimes =>
    Math.ceil(totalAnimes / ANIME_COUNT_PER_REQUEST);

const fetchWatchList = ({ user, type, totalAnimes }) => {
    const maxAnimes = totalAnimes > MAX_ANIMES ? MAX_ANIMES : totalAnimes;
    const maxRequestCount = requiredRequestCount(maxAnimes);

    // generate `maxRequestCount` amount of requests
    // where the offset increases in `ANIME_COUNT_PER_REQUEST`
    const requests = Array.from({ length: maxRequestCount }, i => {
        return scraper.getWatchListFromUser(
            user,
            ANIME_COUNT_PER_REQUEST * (i + 1),
            type
        );
    });

    // flatten the array of arrays into a single array
    return Promise.all(requests).then(flatten);
};

/**
 * ONLY FOR MAL
 * Webscrapes for the number of list entries
 * @param {string} user
 * @returns {Promise<number>}
 */
const fetchUserListSize = username => {
    return text(`https://myanimelist.net/profile/${username}`).then(html => {
        const $ = cheerio.load(html);
        const listSizeElement = $(".stats-data.fl-r .di-ib.fl-r").first();
        const listSize = listSizeElement.text().replace(/,/g, "");
        return Number(listSize);
    });
};

/**
 * Attaches metadata to a single anime
 * fetched from MAL
 * @param {MalAnimeResponse} anime
 * @returns {Anime}
 */
const transformAnime = anime => ({
    score: anime.score,
    title: anime.animeTitle,
    image: anime.animeImagePath.replace("/r/96x136", ""),
    url: `https://myanimelist.net${anime.animeUrl}`,
    tier: helpers.tiers[anime.score]
});

/**
 * Fetches a user's tier list from MAL with
 * added metadata
 * @param {String} user
 * @param {MalListOptions} options
 */
const fetchTierLists = async (user, { after, type } = DEFAULT_MAL_PARAMS) => {
    const totalAnimes = await fetchUserListSize(user);
    const animes = await fetchWatchList({ user, type, totalAnimes });
    //Creates a new array with only the data that transformAnime returns
    return animes.map(transformAnime);
};

router.get("/mal/:user", async (req, res) => {
    const { user } = req.params;
    const listEntries = await fetchTierLists(user);
   	const animes = helpers.tallyAnimeScores(listEntries);
    return res.render('tierList', { animes, user });
});

module.exports = router;
