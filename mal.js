const helpers = require('./helpers')
const scraper = require('mal-scraper');

const DEFAULT_MAL_PARAMS = {
    after: 0,
    type: "anime",
};

/**
 * Attaches metadata to a single anime
 * fetched from MAL
 * @param {MalAnimeResponse} anime 
 * @returns {Anime}
 */
const transformAnime = (anime) => ({
    score: anime.score,
    title: anime.animeTitle,
    image: anime.animeImagePath.replace('/r/96x136',''),
    url: `https://myanimelist.net${anime.animeUrl}`,
    tier: helpers.tiers[anime.score]
})


/**
 * Fetches a user's tier list from MAL with
 * added metadata
 * @param {String} user
 * @param {TierListOptions} options
 */
const fetchTierLists = async (user, { after , type } = DEFAULT_MAL_PARAMS) => {
    const iteration1 = await scraper.getWatchListFromUser(user, after, type);
    const iteration2 = await scraper.getWatchListFromUser(user, 300, type);
    let tiers = iteration1.concat(iteration2); 
    const iteration3 = await scraper.getWatchListFromUser(user, 600, type);
    tiers = tiers.concat(iteration3);

    Promise.all([scraper.getWatchListFromUser(user, after, type),scraper.getWatchListFromUser(user, 300, type), scraper.getWatchListFromUser(user, 600, type)])
    .then((anime) => {
        tiers = anime;
    })
    .catch( () => {
        console.log('Failed request');
    })
    return tiers.map(transformAnime);
}

module.exports = {
    fetchTierLists
}