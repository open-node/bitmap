const Bitmap = require("../");

(() => {
  const canvas = document.getElementById("my-canvas");

  const red = () => (Math.random() * 256) % 256;
  const green = () => (Math.random() * 256) % 256;
  const blue = () => (Math.random() * 256) % 256;

  const bitmap = new Bitmap(canvas, red, green, blue);
  bitmap.draw();
})();
