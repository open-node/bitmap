const Bitmap = require("../");

(() => {
  const canvas = document.getElementById("my-canvas");
  const bitmap = Bitmap(canvas);
  window.bitmap = bitmap;

  const $red = document.getElementById("red");
  const $green = document.getElementById("green");
  const $blue = document.getElementById("blue");

  const $draw = document.getElementById("draw");
  const $play = document.getElementById("play");
  const $stop = document.getElementById("stop");

  const getFns = () => {
    const red = new Function("x", "y", "f", $red.value.trim());
    const green = new Function("x", "y", "f", $green.value.trim());
    const blue = new Function("x", "y", "f", $blue.value.trim());

    return { red, green, blue };
  };

  $draw.onclick = () => {
    const { red, green, blue } = getFns();
    bitmap.init(red, green, blue);
    bitmap.draw();
  };

  $play.onclick = () => {
    const { red, green, blue } = getFns();
    bitmap.init(red, green, blue);
    bitmap.play();
  };

  $stop.onclick = () => {
    bitmap.stop();
  };
})();
