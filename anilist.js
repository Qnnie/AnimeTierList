const helpers = require('./helpers')
const anilist = require('anilist-node');
const Anilist = new anilist();

/**
 * Attaches metadata to a single anime
 * fetched from Anilist
 * @param {AniListAnimeResponse} anime 
 * @returns {Anime}
 */
const transformAnime = (anime) => ({
    score: anime.score,
    title: anime.media.title.english,
    image: anime.media.coverImage.medium,
    url: `https://anilist.co/anime/${anime.id}`,
    tier: helpers.tiers[anime.score]
})

/**
 * Fetches a user's tier list from AniList with
 * added metadata
 * @param {String} user
 * @param {TierListOptions} options
 */
const fetchTierLists = async (user) => {
    //Fetching Data from AniList
    const lists = await Anilist.lists.anime(user); 
    //Grabs only the Completed Anime. Formatted as an object like MAL
    const completedList = lists.find((list) => list.status === 'COMPLETED' && !list.isCustomList).entries;
    return completedList.map(transformAnime);
}

module.exports = {
    fetchTierLists
}