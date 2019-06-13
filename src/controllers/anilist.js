const express = require("express");
const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { json } = require("../utils");

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
const transformAnime = mediaType => anime => ({
    score: anime.score,
    title: anime.media.title.userPreferred,
    image: anime.media.coverImage.medium,
    image_large: anime.media.coverImage.large,
    url: `https://anilist.co/${mediaType}/${anime.mediaId}`,
    tier: helpers.getAnimeTier(anime.score)
});

/**
 * Fetches a user's tier list from AniList with
 * added metadata
 * @param {String} user
 * @param {TierListOptions} options
 */
const fetchTierLists = async (user, mediaType) => {
    const query = fs
        .readFileSync(path.join(__dirname, "..", "graphql", "userList.graphql"))
        .toString();

    const { data, errors } = await anilist(query, {
        user,
        mediaType: mediaType.toUpperCase()
    });

    if (errors && errors.length) {
        return undefined;
    }

    // query is specifically set up to only return one list
    const completedList = data.collection.lists[0].entries;
    return completedList.map(transformAnime(mediaType));
};

const fetchUserProfile = async (name) => {
    const query = fs
    .readFileSync(path.join(__dirname, "..", "graphql", "userProfile.graphql"))
    .toString();

    const { data, errors} = await anilist(query, {name});
    
    if (errors && errors.length) {
        console.log('error');
        return undefined;
    }
    let userImage = data.User.avatar.large;
    let userHeader;
    if (data.User.bannerImage != null) {
        userHeader = `url('${data.User.bannerImage}')`;
    }
    return {
        userImage,
        userHeader
    }
}

router.get("/anilist/:user", async (req, res) => {
    try {
        const { user } = req.params;
        const userProfile = await fetchUserProfile(user);
        const listEntries = await fetchTierLists(user, "anime");
        const animes = helpers.tallyAnimeScores(listEntries);
        return res.render("tierList", { animes, user, userProfile });
    } catch (err) {
        return res.render("404", {
            error: "This anilist account does not exist or is void of rankings"
        });
    }
});

router.get("/anilist/manga/:user", async (req, res) => {
    try {
        const { user } = req.params;
        const userProfile = await fetchUserProfile(user);
        const listEntries = await fetchTierLists(user, "manga");
        const animes = helpers.tallyAnimeScores(listEntries);
        return res.render("tierList", { animes, user, userProfile });
    } catch (err) {
        return res.render("404", {
            error: "This anilist account does not exist or is void of rankings"
        });
    }
});

module.exports = router;
