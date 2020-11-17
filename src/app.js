const hbs = require('hbs');
const express = require('express');
const path = require('path');
const fs = require('fs');
const anilist = require('./controllers/anilist');
const kitsu = require('./controllers/kitsu');
const mal = require('./controllers/mal');

hbs.registerPartial('github-corner', fs.readFileSync(`./src/views/partials/githubCorner.hbs`, 'utf8'));

const app = express();

app.use(anilist);
app.use(kitsu);
app.use(mal);

const publicDirectory = path.join(__dirname, 'public');
const viewsDirectory = path.join(__dirname, 'views');

app.use(express.static(publicDirectory));

app.set('view engine', 'hbs');
app.set('views', viewsDirectory)

app.get('/', async (req, res) => {
    if (!req.query.user) {
        return res.render('index');
    }
    const { user, service } = req.query;

    // ? backwards compatibility
    return res.redirect(`/${service}/${user}`);
});

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is up on port 5000 \nhttp://localhost:5000');
});
