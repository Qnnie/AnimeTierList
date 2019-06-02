const scraper = require('mal-scraper');

const DEFAULT_MAL_PARAMS = {
    after: 0,
    type: "anime"
};

/**
 * Definition of what the ranks
 * that MAL has corresponds to.
 */
const tiers = {
    10: "S",
    9: "A",
    8: "B",
    7: "C",
    6: "D",
    4: "F",
    3: "F",
    5: "F",
    2: "F",
    1: "F",
    0: "unranked",
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
    tier: tiers[anime.score]
})


/**
 * Fetches a user's tier list from MAL with
 * added metadata
 * @param {String} user
 * @param {TierListOptions} options
 */
const fetchTierLists = async (user, { after , type } = DEFAULT_MAL_PARAMS) => {
    const tiers = await scraper.getWatchListFromUser(user, after, type);
    // console.log(tiers.map(transformAnime));
    return tiers.map(transformAnime);
}

/**
 * Tallying animes with attached tier list 
 * metadata under a single object containing tiers
 * @param {Anime[]} animes 
 */
const tallyAnimeScores = (animes) => {
    // When we tally these scores, the animes that don't have
    // any rankings, like no S tier, will automatically be dropped because they 
    // will never be attempted to get converted to an array of animes
    // (because they don't exist)
    return animes.reduce((state, anime) => {
        const { tier } = anime;
        // the current animes that are in the object being built
        const currentTier = state[tier];
        // the updated array, empty if we never added an anime of this tier before
        const newAnimeState = currentTier || [];

        if (currentTier || []) {
            newAnimeState.push(anime)
        }
        return {
            // spread the previous state in to include all previous data
            ...state,
            // set the new tier to equal every anime from before
            // plus the one we just pushed on the updated state
            [tier]: newAnimeState
        }
    }, {} /* initial state */);
}

module.exports = {
    fetchTierLists,
    tallyAnimeScores
}