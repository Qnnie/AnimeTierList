const input = document.getElementById("username");

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
    .addEventListener("click", () => navigate(name => `/mal/${name}`));

document
    .getElementById("searchAnilist")
    .addEventListener("click", () => navigate(name => `/anilist/${name}`));
