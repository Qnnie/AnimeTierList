const input = document.getElementById("username");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("listGenerator").click();
  }
});

document.getElementById('listGenerator').addEventListener('click', () => {
    window.location.href = `/?user=${document.getElementById('username').value}`
});

document.getElementByClassName('anime')