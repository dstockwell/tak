var host = 'http://localhost:61203/';
var file = 'app.js';
var display = document.querySelector("#display");
function loadFile() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', host + file);
  xhr.send();
  xhr.onload = function() {
    display.innerText = xhr.responseText;
  };
}
function saveFile() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', host + file);
  xhr.send(display.innerText);
}
