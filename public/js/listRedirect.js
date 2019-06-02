const input = document.getElementById("username");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("searchMAL").click();
  }
});

document.getElementById('searchMAL').addEventListener('click', () => {
    window.location.href = `/?user=${document.getElementById('username').value}&service=mal`
});

document.getElementById('searchAnilist').addEventListener('click', () => {
    window.location.href = `/?user=${document.getElementById('username').value}&service=anilist`
});