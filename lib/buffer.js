define([], function() {
  var Buffer = function(opt_text) {
    if (opt_text === undefined) {
      opt_text = '';
    }
    this.lines = opt_text.split('\n');
    this.changes = this.lines.map(function() {
      return new Change('inserted');
    });
    this.marks = [];
  };

  Buffer.prototype.insert = function(point, direction, text) {
    var line = this.lines[point.row];
    var newLines = text.split('\n');
    var displaced = line.substring(point.col);
    var firstNewLine = newLines[0];
    var lastNewLine = newLines[newLines.length - 1];
    newLines[newLines.length - 1] += displaced;

    if ((firstNewLine.length > 0 || point.col < line.length) && !(point.col == 0 && newLines.length > 1)) {
      this.changes[point.row].modify();
    }

    this.lines[point.row] = line.substring(0, point.col) + newLines.shift();

    if (newLines.length > 0) {
      Array.prototype.splice.apply(this.lines, [point.row + 1, 0].concat(newLines));
      var insertionRow = point.col == 0 ? point.row : point.row + 1;
      Array.prototype.splice.apply(this.changes, [insertionRow, 0].concat(newLines.map(function() {
        return new Change('inserted');
      })));
    }

    this.marks.forEach(function(mark) {
      if (mark.isBefore(point, direction)) {
        return;
      }
      if (mark.row == point.row) {
        if (newLines.length > 0) {
          mark.col += lastNewLine.length - point.col;
        } else {
          mark.col += firstNewLine.length;
        }
      }
      mark.row += newLines.length;
    });
  };

  Buffer.prototype.delete = function(from, to) {
    var fromLine = this.lines[from.row];
    var toLine = this.lines[to.row];

    this.lines[from.row] = fromLine.substring(0, from.col) + toLine.substring(to.col);
    this.lines.splice(from.row + 1, to.row - from.row);

    // Don't mark as modified if we just shifted a line.
    if ((from.col != 0 || to.col != 0) && !(from.col == fromLine.length && to.col == toLine.length)) {
      this.changes[from.row].modify();
    }
    var deletedChanges = this.changes.splice(from.row + 1, to.row - from.row);
    if (from.col == 0) {
      this.changes[from.row].delete(deletedChanges);
    } else if (this.changes.length > from.row + 1) {
      this.changes[from.row + 1].delete(deletedChanges);
    }

    this.marks.forEach(function(mark) {
      if (mark.row > to.row) {
        mark.row -= to.row - from.row;
        return;
      }
      if (mark.row > from.row) {
        if (mark.row == to.row) {
          if (mark.col <= to.col) {
            mark.col = from.col;
          } else {
            mark.col = from.col + mark.col - to.col;
          }
        }
        mark.row = from.row;
        return;
      }
      if (mark.col > from.col) {
        if (from.row != to.row || mark.col < to.col) {
          mark.col = from.col;
        } else {
          mark.col -= to.col - from.col;
        }
      }
    });
  };

  Buffer.prototype.mark = function(opt_proto) {
    var mark = new Mark(this, opt_proto ? opt_proto.row : 0, opt_proto ? opt_proto.col : 0);
    this.marks.push(mark);
    return mark;
  };

  Buffer.prototype.change = function(kind, deleted) {
    return new Change(kind, deleted);
  };

  Buffer.prototype.clearChanges = function() {
    this.changes.forEach(function(change) {
      change.reset();
    });
  }

  var Mark = function(buffer, row, col) {
    this.buffer = buffer;
    this.row = row;
    this.col = col;
  };

  Mark.prototype.isBefore = function(other, direction) {
    if (this.row != other.row) {
      return this.row < other.row;
    }
    if (this.col < other.col) {
      return this.col < other.col;
    }
    return direction != 'before';
  };

  var Change = function(kind, deleted) {
    this.kind = kind;
    this.deleted = deleted === undefined ? 0 : deleted;
  };

  Change.prototype.modify = function() {
    if (this.kind != 'inserted') {
      this.kind = 'modified';
    }
  };

  Change.prototype.delete = function(changes) {
    changes.forEach(function(change) {
      this.deleted += change.deleted;
      if (change.kind != 'inserted') {
        this.deleted++;
      }
    }, this);
  };

  Change.prototype.reset = function() {
    this.kind = 'nochange';
    this.deleted = 0;
  };

  return Buffer;
});