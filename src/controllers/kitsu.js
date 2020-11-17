const express = require("express");
const helpers = require("../helpers");
const fs = require("fs");
const path = require("path");
const { json } = require("../utils");

const router = express.Router();

const kitsu = (query, variables) => {
    return json("https://kitsu.io/api/graphql", {
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
 * Attaches metadata to a single entry
 * fetched from Kitsu
 * @param {KitsuEntryResponse} entry
 * @returns {Anime}
 */
const transformAnime = mediaType => entry => ({
    score: entry.rating / 2,
    title: entry.media.titles.canonical,
    image: entry.media.posterImage.medium[0].url,
    url: `https://kitsu.io/${mediaType}/${entry.media.id}`,
    tier: helpers.getAnimeTier(entry.rating / 2)
});

/**
 * Fetches a user's tier list from Kitsu with
 * added metadata
 * @param {String} user
 * @param {TierListOptions} options
 */
const fetchTierLists = async (user, mediaType) => {
    const query = fs
        .readFileSync(path.join(__dirname, "..", "graphql", "kitsu", "userList.graphql"))
        .toString();

    let collection = []
    let hasNextPage = true
    let endCursor = null

    do {
        const { data, errors } = await kitsu(query, {
            user,
            mediaType: mediaType.toUpperCase(),
            endCursor
        });

        if (errors && errors.length) {
            return undefined;
        }

        if (!data?.User?.library?.completed) {
            hasNextPage = false;
        } else {
            const library = data.User.library.completed
            hasNextPage = library.pageInfo.hasNextPage
            endCursor = library.pageInfo.endCursor
            collection = collection.concat(library.nodes)
        }
    } while (hasNextPage)

    return collection.map(transformAnime(mediaType));
};

const fetchUserProfile = async (name) => {
    const query = fs
    .readFileSync(path.join(__dirname, "..", "graphql", "kitsu", "userProfile.graphql"))
    .toString();

    const { data, errors} = await kitsu(query, {name});

    if (errors && errors.length) {
        console.log('error');
        return undefined;
    }
    let userImage = data.User.avatarImage.large[0].url;
    let userHeader;
    if (data.User.bannerImage.large[0].url != null) {
        userHeader = `url('${data.User.bannerImage.large[0].url}')`;
    }
    return {
        userImage,
        userHeader
    }
}

router.get("/kitsu/:user", async (req, res) => {
    try {
        const { user } = req.params;
        const userProfile = await fetchUserProfile(user);
        const listEntries = await fetchTierLists(user, "anime");
        const animes = helpers.tallyAnimeScores(listEntries);
        return res.render("tierList", { animes, user, userProfile });
    } catch (err) {
        return res.render("404", {
            error: `This kitsu account does not exist or is void of rankings ${err}`
        });
    }
});

router.get("/kitsu/manga/:user", async (req, res) => {
    try {
        const { user } = req.params;
        const userProfile = await fetchUserProfile(user);
        const listEntries = await fetchTierLists(user, "manga");
        const animes = helpers.tallyAnimeScores(listEntries);
        return res.render("tierList", { animes, user, userProfile });
    } catch (err) {
        return res.render("404", {
            error: `This kitsu account does not exist or is void of rankings ${err}`
        });
    }
});

module.exports = router;
