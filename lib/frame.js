define(['lib/buffer'], function(Buffer) {
  function Frame() {
    this.buffer = new Buffer();
    this.cursor = this.buffer.mark({row: 0, col: 0});
    this._element = document.createElement('div');
    this._element.classList.add('frame');
    this._cursorElement = document.createElement('span');
    this._cursorElement.classList.add('cursor');
    this._updateScheduled = false;
  }
  
  Frame.prototype.update = function() {
    if (this._updateScheduled) {
      return;
    }
    this._updateScheduled = true;
    requestAnimationFrame(function() {
      this._updateScheduled = false;
      var elements = this._element.children;
      var lines = this.buffer.lines;
      var changes = this.buffer.changes;
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
          var element = document.createElement('div');
          element.classList.add('line');
          this._element.insertBefore(element, elements[i]);
        }
        if (i == this.cursor.row) {
          var element = elements[i];
          var pre = line.substring(0, this.cursor.col);
          var post = line.substring(this.cursor.col);
          element.textContent = pre;
          element.appendChild(this._cursorElement);
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
      this.buffer.clearChanges();
    }.bind(this));
  };

  return Frame;
});