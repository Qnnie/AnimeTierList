const express = require('express');
const path = require('path');
const hbs = require('hbs');
const malScraper = require('mal-scraper');
const tierList = require('./tierList');

const app = express();

const publicDirectoryPath = path.join(__dirname, './public');
app.use(express.static(publicDirectoryPath));

app.set('view engine', 'hbs');

// Get you an object containing all the entries with status, score... from this user's watch list
malScraper.getWatchListFromUser(tierList.username, tierList.after, tierList.type)
    .then((data) => {
        data.forEach((anime) => {
            const anime_image = anime.animeImagePath.replace('/r/96x136','');
            const anime_url = `https://myanimelist.net${anime.animeUrl}`;
            tierList.animeList.push({
                title: anime.animeTitle,
                score: anime.score,
                image: anime_image,
                url: anime_url
            });
        });
        tierList.createTierList();
        tierList.printTierList();
    })
    .catch((err) => console.log(err));

app.get('', (req, res) => {
    res.render('index', {
        user: tierList.username,
        S: tierList.S_Tier,
        A: tierList.A_Tier,
        B: tierList.B_Tier,
        C: tierList.C_Tier,
        D: tierList.D_Tier,
        F: tierList.F_Tier,
        unranked: tierList.unranked
    })
});

app.listen(3000, () => {
        console.log('Server is up on port 3000');
});