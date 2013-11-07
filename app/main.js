define(['lib/input', 'lib/frame'], function(input, Frame) {
  var host = 'http://localhost:61203/';
  var file = 'app/main.js';
  var frame = new Frame();
  document.documentElement.appendChild(frame._element);
  function loadFile() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', host + file);
    xhr.send();
    xhr.onload = function() {
      var lastRow = frame.buffer.lines.length -1;
      var lastCol = frame.buffer.lines[lastRow].length;
      frame.buffer.delete({row: 0, col: 0}, {row: lastRow, col: lastCol});
      frame.buffer.insert({row: 0, col: 0}, 'after', xhr.responseText);
      frame.update();
    };
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
      if (keyString == 'Enter' || keyString == 'RightAlt') {
        text = '\n'
      } else if (keyString == 'Ctrl-R') {
        loadFile();
      } else if (keyString == 'Ctrl-C') {
        var lastRow = frame.buffer.lines.length -1;
        frame.buffer.delete(
            {row: 0, col: 0},
            {row: lastRow, col: frame.buffer.lines[lastRow].length});
      } else if (keyString == 'Ctrl-J') {
        if (frame.cursor.row < frame.buffer.lines.length) {
          frame.cursor.row++;
        }
      } else if (keyString == 'Ctrl-K') {
        if (frame.cursor.row > 0) {
          frame.cursor.row--;
        }
      } else if (keyString == 'Ctrl-H') {
        if (frame.cursor.col > 0) {
          frame.cursor.col--;
        }
      } else if (keyString == 'Ctrl-L') {
        if (frame.cursor.col < frame.buffer.lines[frame.cursor.row].length) {
          frame.cursor.col++;
        }
      } else if (keyString == 'Backspace' || keyString == 'LeftAlt') {
        var prev = {row: frame.cursor.row, col: frame.cursor.col - 1};
        if (prev.col < 0) {
          if (prev.row == 0) {
            return;
          }
          prev.row--;
          prev.col = frame.buffer.lines[prev.row].length;
        }
        frame.buffer.delete(prev, {row: frame.cursor.row, col: frame.cursor.col});
      }
    }
    if (text !== '') {
      frame.buffer.insert({row: frame.cursor.row, col: frame.cursor.col}, 'before', text);
    }
    frame.update();
  }
  
  input.setHandler(onkey);
});