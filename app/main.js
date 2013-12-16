define(['lib/input', 'lib/frame'], function(input, Frame) {
  var frame = new Frame();
  document.documentElement.appendChild(frame._element);
  input.setHandler(function (key) {
    frame.mode.onkey(key);
    frame.update();
  });
});