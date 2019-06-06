const input = document.getElementById("username");

let manga = document.getElementById("manga-search");
manga.classList.toggle("darken-button");
let defaultSearch = true;

input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("searchMAL").click();
    }
});

const Loader = () => {
    document.getElementById("loader-wrapper").style.visibility = "visible";
};

const navigate = f => {
    const name = document.getElementById("username").value;
    Loader();
    window.location.href = f(name);
};

document
    .getElementById("searchMAL")
    .addEventListener("click", () => {
        if (defaultSearch) {
            navigate(name => `/mal/${name}`)
        } 
        else {
            navigate(name => `/mal/manga/${name}`)
        }
    });

document
    .getElementById("searchAnilist")
    .addEventListener("click", () => {
        navigate(name => `/anilist/${name}`)
    });

const toggleSearchState = () => {
        let anime = document.getElementById("anime-search");
        anime.classList.toggle("darken-button");
        let manga = document.getElementById("manga-search");
        manga.classList.toggle("darken-button");
}

document
    .getElementById('manga-search')
    .addEventListener("click", () => {
        defaultSearch = false;
        toggleSearchState();
    });

document
    .getElementById('anime-search')
    .addEventListener("click", () => {
        defaultSearch = true;
        toggleSearchState();
    });
