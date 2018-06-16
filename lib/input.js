  var handler = function() {};
  var keyState = {
    alt: false,
    ctrl: false,
    shift: false,
  };
  var Key = function(keyState, key, text) {
    this.ctrl = keyState.ctrl;
    this.shift = keyState.shift;
    this.alt = keyState.alt;
    this.key = key;
    this.text = text;
    this.normalize();
  };
  Key.prototype.isText = function() {
    return this.text !== undefined;
  };
  Key.prototype.normalize = function() {
    if (this.key !== undefined && this.key.indexOf('U+') == 0) {
      this.key = String.fromCharCode(parseInt(/[A-F0-9]+$/.exec(this.key)[0], 16));
      if (this.key == '\u0008') {
        this.key = 'Backspace';
      } else if (this.key == '\u0009') {
        this.key = 'Tab';
      } else if (this.key == '\u00A2') {
        this.key = 'Ctrl';
        this.ctrl = false;
      } else if (this.key == '\u00A4') {
        this.alt = false;
        this.key = 'LeftAlt';
      } else if (this.key == '\u00A5') {
        this.alt = false;
        this.key = 'RightAlt';
      } else if (!this.ctrl && !this.alt) {
        this.text = this.key;
      }
    }
  };
  Key.prototype.toString = function() {
    var result = '';
    if (this.text !== undefined) {
      return this.text;
    }
    if (this.ctrl) {
      result += 'Ctrl-';
    }
    if (this.alt) {
      result += 'Alt-';
    }
    if (this.shift) {
      result += 'Shift-';
    }
    result += this.key;
    return result;
  }
  function handleInput(e) {
    handler(new Key(keyState, undefined, e.target.value));
  }
  function handleKey(e, direction) {
    var alt = e.altKey;
    var ctrl = e.ctrlKey;
    var shift = e.shiftKey;
    if (alt !== keyState.alt) {
      keyState.alt = alt;
    }
    if (ctrl !== keyState.ctrl) {
      keyState.ctrl = ctrl;
    }
    if (shift !== keyState.shift) {
      keyState.shift = shift;
    }
    if (direction == 'down') {
      var key = new Key(keyState, e.keyIdentifier);
      if (key.text !== undefined) {
        return;
      }
      if (key.ctrl && key.key == 'V') {
        // FIXME: handle binding to paste
        return;
      }
      handler(key);
      e.preventDefault();
    }
  }
  var input = document.createElement('textarea');
  document.documentElement.insertBefore(input, document.documentElement.firstChild);
  input.id = 'input';
  input.onkeydown = function(e) { handleKey(e, 'down'); };
  input.onkeyup = function(e) { handleKey(e, 'up'); };
  input.oninput = function(e) { handleInput(e); e.target.value = ''; };
  input.onblur = function(e) {
    setTimeout(function() {
      input.focus();
    }, 0);
  };
  input.focus();
  export function setHandler(f) {
    handler = f;
  }
