const tierBreakpoints = [
    {
        tier: 'SS',
        breakpoint: 10
    },
    {
        tier: 'S',
        breakpoint: 9
    },
    {
        tier: 'A',
        breakpoint: 8
    },
    {
        tier: 'B',
        breakpoint: 7
    },
    {
        tier: 'C',
        breakpoint: 6
    },
    {
        tier: 'D',
        breakpoint: 4
    },
    {
        tier: 'F',
        breakpoint: 0
    }
]

const getAnimeTier = (score) => {
    if (score === 0) {
        return 'unranked'
    }

    for (let i = 0; i < tierBreakpoints.length; i++) {
        if (score >= tierBreakpoints[i].breakpoint) {
            return tierBreakpoints[i].tier
        } 
    }
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
        const { tier } = anime; //Grabs anime.tier 
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
    getAnimeTier,
    tallyAnimeScores
}