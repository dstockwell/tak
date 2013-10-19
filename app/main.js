define(['lib/input'], function(input) {
  var host = 'http://localhost:61203/';
  var file = 'app/main.js';
  var display = document.querySelector('#display');
  var point = document.querySelector('#point');
  function loadFile() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', host + file);
    xhr.send();
    xhr.onload = function() {
      display.innerText = xhr.responseText;
      ensurePoint();
    };
  }
  function saveFile() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', host + file);
    xhr.send(display.innerText);
  }
  function ensurePoint() {
    if (!point.parentNode) {
      display.insertBefore(point, display.firstChild);
    }
  }
  function onkey(key) {
    var text = '';
    if (key.isText()) {
      text = key.text;
    } else {
      var keyString = key.toString();
      if (keyString == 'Enter') {
        text = '\n'
      } else if (keyString == 'Ctrl-R') {
        loadFile();
        return;
      } else if (keyString == 'Ctrl-C') {
        display.innerText = '';
        return;
      } else if (keyString == 'Ctrl-H') {
        if (!point.previousSibling) {
          return;
        }
        if (point.previousSibling.length > 1) {
          point.previousSibling.splitText(point.previousSibling.length - 1);
        }
        point.parentNode.insertBefore(point, point.previousSibling);
        return;
      } else if (keyString == 'Ctrl-L') {
        if (!point.nextSibling) {
          return;
        }
        if (point.nextSibling.length > 1) {
          point.nextSibling.splitText(1);
        }
        point.parentNode.insertBefore(point, point.nextSibling.nextSibling);
        return;
      } else if (keyString == 'Backspace') {
        if (!point.previousSibling) {
          return;
        }
        if (point.previousSibling.length > 1) {
          point.previousSibling.splitText(point.previousSibling.length - 1);
        }
        point.previousSibling.remove();
      }
    }
    if (text !== '') {
      point.insertAdjacentText('beforeBegin', text);
    }
  }
  
  input.setHandler(onkey);
});