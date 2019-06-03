const helpers = require("./helpers");
const cheerio = require("cheerio");
const scraper = require("mal-scraper");
const fetch = require("node-fetch");
const { text, flatten } = require("./utils");

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
<<<<<<< HEAD
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
=======
>>>>>>> 3212649a1f83dbde8643c5809faf3f0a217d0bec
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
<<<<<<< HEAD
const fetchTierLists = async (user, { after, type } = DEFAULT_MAL_PARAMS) => {
  const totalAnimes = await fetchUserListSize(user);
  const animes = await fetchWatchList({ user, type, totalAnimes });
  //Creates a new array with only the data that transformAnime returns
  return animes.map(transformAnime);
};

module.exports = {
  fetchTierLists,
  fetchUserListSize
};
=======
const fetchTierLists = async (user, { after , type } = DEFAULT_MAL_PARAMS) => {
    //The reason we change after twice is to get list sizes greater than 300.
    //In this case we are getting up to 900 Entries 
    const iteration1 = await scraper.getWatchListFromUser(user, after, type);
    const iteration2 = await scraper.getWatchListFromUser(user, 300, type);
    const iteration3 = await scraper.getWatchListFromUser(user, 600, type);
    //Throws all anime objects into the same array.
    const tiers = iteration1.concat(iteration2).concat(iteration3);
    //Creates a new array with only the data that transformAnime returns
    return tiers.map(transformAnime);
}

module.exports = {
    fetchTierLists
}
>>>>>>> 3212649a1f83dbde8643c5809faf3f0a217d0bec
