import {Mode} from './mode.js';
export function Insert(frame) {
  this.frame = frame;
}
Insert.prototype.onkey = function(key) {
  var text = '';
  var frame = this.frame;
  if (key.isText()) {
    text = key.text;
  } else {
    var keyString = key.toString();
    switch (keyString) {
      case 'Ctrl-G':
        return Mode.pop();
      case 'Enter':
      case 'RightAlt':
        text = '\n';
        break;
      case 'Backspace':
      case 'LeftAlt':
        var prev = {row: frame.cursor.row, col: frame.cursor.col - 1};
        if (prev.col < 0) {
          if (prev.row == 0) {
            return;
          }
          prev.row--;
          prev.col = frame.buffer.lines[prev.row].length;
        }
        frame.buffer.delete(prev, {row: frame.cursor.row, col: frame.cursor.col});
        return;
    }
  }
  if (text !== '') {
    frame.buffer.insert({row: frame.cursor.row, col: frame.cursor.col}, 'before', text);
  }
};
