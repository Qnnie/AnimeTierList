const express = require('express');
const path = require('path');
const hbs = require('hbs');
const mal = require('./mal');
const anilist = require('./anilist');
const helpers = require('./helpers')

const app = express();

const publicDirectoryPath = path.join(__dirname, './public');
app.use(express.static(publicDirectoryPath));

app.set('view engine', 'hbs');

app.get('', async (req, res) => {
    if (!req.query.user) {
        return res.render('index');
    }
    const { user, service } = req.query;   

    let listEntries

    switch (service) {
    	case 'anilist':
    	 	listEntries = await anilist.fetchTierLists(req.query.user);
    	break
    	case 'mal':
    	default:
            listEntries = await mal.fetchTierLists(req.query.user);
    	break
    }

   	const animes = helpers.tallyAnimeScores(listEntries);

    res.render('tierList', { animes, user });
});

app.listen(process.env.PORT || 5000, () => {
        console.log('Server is up on port 5000');
});

