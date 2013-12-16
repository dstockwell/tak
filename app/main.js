import * as input from '../lib/input.js';
import {Frame} from '../lib/frame.js';

  var host = 'http://localhost:61203/';
  var file = 'app/main.js';
  var frame = new Frame();
  document.documentElement.appendChild(frame._element);
  input.setHandler(function (key) {
    frame.mode.onkey(key);
    frame.update();
  });
