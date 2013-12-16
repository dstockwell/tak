export function Mode(frame, initial) {
  this._frame = frame;
  this._modes = [];
  this._handlers = [];
  this._modes.push(new initial(frame));
  this._handlers.push(function() {});
}
Mode.prototype.onkey = function(key) {
  var operation = this._modes[this._modes.length - 1].onkey(key);
  if (!operation) {
    return;
  }
  switch (operation.kind) {
    case 'push':
      this._modes.push(new operation.mode(this._frame));
      this._handlers.push(operation.handler || function() {});
      return;
    case 'pop':
      var finished = this._modes.pop();
      this._handlers.pop()(operation.result);
      return;
    default:
      return;
  }
};
Mode.push = function(mode, handler) {
  return {
    kind: 'push',
    mode: mode,
    handler: handler
  };
};
Mode.pop = function(result) {
  return {
    kind: 'pop',
    result: result
  };
};
