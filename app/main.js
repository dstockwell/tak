define(['lib/input', 'lib/buffer'], function(input, Buffer) {
  var host = 'http://localhost:61203/';
  var file = 'app/main.js';
  var buffer = new Buffer();
  var cursor = document.querySelector('#cursor');
  cursor.mark = buffer.mark({row: 0, col: 0});
  var display = document.querySelector('#display');
  function loadFile() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', host + file);
    xhr.send();
    xhr.onload = function() {
      var lastRow = buffer.lines.length -1;
      var lastCol = buffer.lines[lastRow].length;
      buffer.delete({row: 0, col: 0}, {row: lastRow, col: lastCol});
      buffer.insert({row: 0, col: 0}, 'after', xhr.responseText);
      updateDisplay();
    };
  }
  var updateScheduled = false;
  function updateDisplay() {
    if (updateScheduled) {
      return;
    }
    updateScheduled = true;
    requestAnimationFrame(function() {
      updateScheduled = false;
      var elements = display.children;
      var lines = buffer.lines;
      var changes = buffer.changes;
      for (var i = 0; i < changes.length; i++) {
        var line = lines[i];
        if (line == '') {
          line = ' ';
        }
        var change = changes[i];
        for (var j = 0; j < change.deleted; j++) {
          elements[i].remove();
        }
        if (change.kind == 'inserted') {
          display.insertBefore(document.createElement('div'), elements[i]);
        }
        if (i == cursor.mark.row) {
          var element = elements[i];
          var pre = line.substring(0, cursor.mark.col);
          var post = line.substring(cursor.mark.col);
          element.textContent = pre;
          element.appendChild(cursor);
          element.appendChild(document.createTextNode(post));
          element.classList.add('cursor-line');
        } else if (change.kind == 'modified' || change.kind == 'inserted') {
          elements[i].textContent = line;
          elements[i].classList.remove('cursor-line');
        } else {
          elements[i].classList.remove('cursor-line');
        }
      }
      while (elements.length > lines.length) {
        elements[elements.length - 1].remove();
      }
      buffer.clearChanges();
    });
  }
  function saveFile() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', host + file);
    xhr.send(display.innerText);
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
      } else if (keyString == 'Ctrl-C') {
        var lastRow = buffer.lines.length -1;
        buffer.delete(
            {row: 0, col: 0},
            {row: lastRow, col: buffer.lines[lastRow].length});
      } else if (keyString == 'Ctrl-J') {
        if (cursor.mark.row < buffer.lines.length) {
          cursor.mark.row++;
        }
      } else if (keyString == 'Ctrl-K') {
        if (cursor.row > 0) {
          cursor.mark.row--;
        }
      } else if (keyString == 'Ctrl-H') {
        if (cursor.col > 0) {
          cursor.mark.col--;
        }
      } else if (keyString == 'Ctrl-L') {
        if (cursor.mark.col < buffer.lines[cursor.mark.row].length) {
          cursor.mark.col++;
        }
      } else if (keyString == 'Backspace') {
        var prev = {row: cursor.mark.row, col: cursor.mark.col - 1};
        if (prev.col < 0) {
          if (prev.row == 0) {
            return;
          }
          prev.row--;
          prev.col = buffer.lines[prev.row].length;
        }
        buffer.delete(prev, {row: cursor.mark.row, col: cursor.mark.col});
      }
    }
    if (text !== '') {
      buffer.insert({row: cursor.mark.row, col: cursor.mark.col}, 'before', text);
    }
    updateDisplay();
  }
  
  input.setHandler(onkey);
});