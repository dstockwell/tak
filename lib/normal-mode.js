import {Mode} from './mode.js';
import {Insert} from './insert-mode.js';

export function Normal(frame) {
  this.frame = frame;
  this.count = '0';
}
Normal.prototype.onkey = function(key) {
  var keyString = key.toString();
  var frame = this.frame;
  switch (keyString) {
    case '0':
      if (this.count == 0) {
        break;
      }
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      this.count *= 10;
      this.count += Number(keyString);
      return;
  }
  var operation;
  var count = this.count == 0 ? 1 : this.count;
  switch (keyString) {
    case '0': 
      frame.cursor.col = 0;
      break;
    case '$':
      frame.cursor.row = Math.min(frame.cursor.row + count - 1, frame.buffer.lines.length - 1);
      frame.cursor.col = frame.buffer.lines[frame.cursor.row].length;
      break;
    case 'x':
      var from = {row: frame.cursor.row, col: frame.cursor.col};
      var to = {row: frame.cursor.row, col: frame.cursor.col};
      for (var i = 0; i < count; i++) {
        if (to.col == frame.buffer.lines[to.row].length) {
          if (to.row == frame.buffer.lines.length - 1) {
            break;
          }
          to.row++;
          to.col = 0;
        } else {
          to.col++;
        }
      }
      frame.buffer.delete(from, to);
      break;
    case 'j':
      frame.cursor.row = Math.min(frame.cursor.row + count, frame.buffer.lines.length - 1);
      break;
    case 'k':
      frame.cursor.row = Math.max(0, frame.cursor.row - count);
      break;
    case 'h':
      frame.cursor.col = Math.max(0, frame.cursor.col - count);
      break;
    case 'l':
      frame.cursor.col = Math.min(frame.cursor.col + count, frame.buffer.lines[frame.cursor.row].length);
      break;
    case 'i':
      // FIXME: repeat
      operation = Mode.push(Insert);
      break;
  }
  this.count = 0;
  return operation;
};
