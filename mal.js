const helpers = require('./helpers')
const cheerio = require('cheerio');
const scraper = require('mal-scraper');
const request = require('request');

const DEFAULT_MAL_PARAMS = {
    after: 0,
    type: "anime",
};

/**
 * ONLY FOR MAL
 * Webscrapes for the number of list entries
 * @param {String} user
 * @returns {listSize} 
 */
const fetchUserListSize = (username) => {
    request({url: `https://myanimelist.net/profile/${username}`}, (err, res, html) => {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(html);
            const listSize = $(".stats-data.fl-r .di-ib.fl-r");
            console.log(listSize.text())
            return parseInt(listSize.text());
        } 
        else {
            console.log('Could not fetch list size');
        }
    });
}

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
 * @param {MalListOptions} options
 */
const fetchTierLists = async (user, { after , type } = DEFAULT_MAL_PARAMS) => {
    fetchUserListSize(user);
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
    fetchTierLists,
    fetchUserListSize
}
