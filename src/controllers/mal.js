const helpers = require("../helpers");
const cheerio = require("cheerio");
const scraper = require("mal-scraper");
const fetch = require("node-fetch");
const { text, flatten } = require("../utils");
const { Router } = require("express");

const router = new Router();

const ANIME_COUNT_PER_REQUEST = 300;
const MAX_ANIMES = 900;

const DEFAULT_MAL_PARAMS = {
    after: 0,
    type: "anime"
};

let userImage = '/images/mascot2.jpg';
let userBackground = 'white';

/**
 * Calculates the amount of requests required to
 * fetch a user's entire collection
 * @param {number} totalAnimes
 */
const requiredRequestCount = totalAnimes =>
    Math.ceil(totalAnimes / ANIME_COUNT_PER_REQUEST);

const fetchWatchList = ({ user, type, totalAnimes }) => {
    const recurse = async (offset) => {
        if (offset >= totalAnimes) {
            return [];
        }
        // generate `maxRequestCount` amount of requests
        // where the offset increases in `ANIME_COUNT_PER_REQUEST`
        const result = await scraper.getWatchListFromUser(user, offset, type);

        if (result.length < 1) {
            return [];
        }

        const nextCursorAt = offset + result.length;

        // flatten the array of arrays into a single array
        return [
            ...result,
            ...await recurse(nextCursorAt)
        ];
    };
    return recurse(0).then(flatten);
};
/**
 * ONLY FOR MAL
 * Webscrapes for the number of list entries
 * @param {string} user
 * @returns {Promise<number>}
 */
const fetchMALProfile = username => {
    return text(`https://myanimelist.net/profile/${username}`).then(html => {
        const $ = cheerio.load(html);
        const elements = Array.from($(".anime .stats-status .di-ib.fl-r.lh10"));
        userImage = $(".user-image.mb8 img").attr('src');
        const getBackgroundUrl = () => {
            userBio = $(".word-break").text();
            let start = userBio.indexOf("{{");
            let end = userBio.indexOf("}}");
            userBackground = userBio.slice((start+2), (end));
            userBackground = `url('${userBackground}')`;
        };
        getBackgroundUrl();
        return elements.reduce((all, elem) => all + Number(elem.children[0].data.replace(/,/g, "")), 0)
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
    tier: helpers.getAnimeTier(anime.score),
});

const transformManga = manga => ({
    score: manga.score,
    title: manga.mangaTitle,
    image: manga.mangaImagePath.replace("/r/96x136", ""),
    url: `https://myanimelist.net${manga.mangaUrl}`,
    tier: helpers.getAnimeTier(manga.score)
});

/**
 * Fetches a user's tier list from MAL with
 * added metadata
 * @param {String} user
 * @param {MalListOptions} options
 */
const fetchTierLists = async (user, { after, type } = DEFAULT_MAL_PARAMS) => {
    const totalAnimes = await fetchMALProfile(user);
    //ToDo -> Total Manga
    const animes = await fetchWatchList({ user, type, totalAnimes });
    //Creates a new array with only the data that transformAnime/Manga returns
    if (type == 'manga') { 
        return animes.map(transformManga); 
    }
    return animes.map(transformAnime);
};

router.get("/mal/:user", async (req, res) => {
    const { user } = req.params;
    const listEntries = await fetchTierLists(user);
    const animes = helpers.tallyAnimeScores(listEntries);
    if (listEntries === undefined || listEntries.length == 0) {
        return res.render("404", { error: 'MAL Account does not exist, or is void of rankings' });
    }
    return res.render("tierList", { animes, user, userImage, userBackground });
});

router.get("/mal/manga/:user", async (req, res) => {
    const { user } = req.params;
    const listEntries = await fetchTierLists(user,{type:'manga'});
    const animes = helpers.tallyAnimeScores(listEntries);
    if (listEntries === undefined || listEntries.length == 0) {
        return res.render("404", { error: 'MAL Account does not exist, or is void of rankings' });
    }
    return res.render("tierList", { animes, user, userImage, userBackground });
});

module.exports = router;
