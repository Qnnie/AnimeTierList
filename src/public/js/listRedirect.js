const input = document.getElementById("username");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("searchMAL").click();
  }
});

const Loader = () => {
  document.getElementById('loader-wrapper').style.visibility = "visible";
}

document.getElementById('searchMAL').addEventListener('click', () => {
    Loader();
    window.location.href = `/mal/${document.getElementById('username')}`
});

document.getElementById('searchAnilist').addEventListener('click', () => {
    Loader();
    window.location.href = `/anilist/${document.getElementById('username').value}`
});
