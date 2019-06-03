/**
 * Definition of what the ranks
 * that Anilist has corresponds to.
 */
const tiers = {
    10: "SS",
    9: "S",
    8: "A",
    7: "B",
    6: "C",
    5: "D",
    4: "D",
    3: "F",
    2: "F",
    1: "F",
    0: "unranked",
}

/**
 * Tallying animes with attached tier list 
 * metadata under a single object containing tiers
 * @param {AnimeList[]} animes 
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
    tiers,
    tallyAnimeScores
}