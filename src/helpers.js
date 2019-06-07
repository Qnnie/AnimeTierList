let tierBreakpoints = [
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
    return animes.reduce((state, anime) => {
        const { tier } = anime; //Grabs anime.tier

        // the updated array, empty if we never added an anime of this tier before
        const newTier = state[tier] || []; 
        
        newTier.push(anime);
        
        return {
            ...state,
            [tier]: newTier
        }
    }, {});
}

module.exports = {
    getAnimeTier,
    tallyAnimeScores,
    tierBreakpoints
}
