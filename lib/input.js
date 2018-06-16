  var handler = function() {};
  var keyState = {
    alt: false,
    ctrl: false,
    shift: false,
    meta: false,
  };
  var Key = function(keyState, key, text) {
    this.ctrl = keyState.ctrl;
    this.shift = keyState.shift;
    this.alt = keyState.alt;
    this.meta = keyState.meta;
    this.key = key;
    this.text = text;
    this.normalize();
  };
  Key.prototype.isText = function() {
    return this.text !== undefined;
  };
  Key.prototype.normalize = function() {
    if (this.key !== undefined) {
      if (this.key == 'ControlLeft' || this.key == 'ControlRight') {
        this.ctrl = false;
      } else if (this.key == 'AltLeft' || this.key == 'AltRight') {
        this.alt = false;
      } else if (this.key == 'ShiftLeft' || this.key == 'ShiftRight') {
        this.shift = false;
      } else if (this.key == 'MetaLeft' || this.key == 'MetaRight') {
        this.meta = false;
      } else if (this.key.startsWith('Key')) {
        this.key = this.key.replace('Key', '');
      }
    }
    if (this.ctrl || this.shift || this.alt || this.meta) {
      this.text = undefined;
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
    if (this.meta) {
      result += 'Meta-';
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
    var meta = e.metaKey;
    if (alt !== keyState.alt) {
      keyState.alt = alt;
    }
    if (ctrl !== keyState.ctrl) {
      keyState.ctrl = ctrl;
    }
    if (shift !== keyState.shift) {
      keyState.shift = shift;
    }
    if (meta !== keyState.meta) {
      keyState.meta = meta;
    }
    if (direction == 'down') {
      let text;
      if (e.key.length == 1) {
        text = e.key;
      }
      var key = new Key(keyState, e.code, text);
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
