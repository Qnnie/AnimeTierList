const express = require("express");
const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { json } = require("../utils");

const query = fs
    .readFileSync(path.join(__dirname, "..", "graphql", "userAnimes.graphql"))
    .toString();

const router = express.Router();

const anilist = (query, variables) => {
    return json("https://graphql.anilist.co", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query,
            variables
        })
    });
};

/**
 * Attaches metadata to a single anime
 * fetched from Anilist
 * @param {AniListAnimeResponse} anime
 * @returns {Anime}
 */
const transformAnime = anime => ({
    score: anime.score,
    title: anime.media.title.userPreferred,
    image: anime.media.coverImage.medium,
    image_large: anime.media.coverImage.large,
    url: `https://anilist.co/anime/${anime.mediaId}`,
    tier: helpers.tiers[anime.score]
});

/**
 * Fetches a user's tier list from AniList with
 * added metadata
 * @param {String} user
 * @param {TierListOptions} options
 */
const fetchTierLists = async user => {
    const { data, errors } = await anilist(query, { user });
    
    if (errors && errors.length) {
        return undefined;
    }

    // query is specifically set up to only return one list
    const completedList = data.collection.lists[0].entries;
    return completedList.map(transformAnime);
};

router.get("/anilist/:user", async (req, res) => {
    try {
        const {user} = req.params;
        const listEntries = await fetchTierLists(user);
        const animes = helpers.tallyAnimeScores(listEntries);

        return res.render("tierList", { animes, user });
    } catch (err) {
        return res.render('404', {error: 'This anilist account does not exist'});
    }
});

module.exports = router;