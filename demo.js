(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @param {dom} canvas canvas dom object
 * @class
 * @return {Bitmap} Instance
 */
function Bitmap(canvas) {
  // 帧计数器
  let fno = 0;

  // 动画是否执行中
  let animating = false;

  const ctx = canvas.getContext("2d");
  const { height, width } = canvas;

  const data = ctx.getImageData(0, 0, width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const start = 4 * (y * width + x);
      data.data[start + 3] = 255;
    }
  }

  /**
   * 初始化r,g,b函数
   * @memberof Bitmap
   * @instance
   * @param {function} red
   * @param {function} green
   * @param {function} blue
   *
   * @return {void}
   */
  const init = (red, green, blue) => {
    this.red = red;
    this.green = green;
    this.blue = blue;
  };

  /**
   * 静态绘制
   * @memberof Bitmap
   * @instance
   *
   * @return {void}
   */
  const draw = () => {
    if (animating) {
      fno += 1;
      requestAnimationFrame(draw);
    }

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const start = 4 * (y * width + x);
        data.data[start] = this.red(x, y, fno);
        data.data[start + 1] = this.green(x, y, fno);
        data.data[start + 2] = this.blue(x, y, fno);
      }
    }
    ctx.putImageData(data, 0, 0, 0, 0, width, height);
  };

  /**
   * 动画绘制开启
   * @memberof Bitmap
   * @instance
   *
   * @return {void}
   */
  const play = () => {
    if (!animating) requestAnimationFrame(draw);

    animating = true;
  };

  /**
   * 动画绘制关闭
   * @memberof Bitmap
   * @instance
   *
   * @return {void}
   */
  const stop = () => {
    fno = 0;
    animating = false;
  };

  return { init, draw, play, stop };
}

module.exports = Bitmap;

},{}],2:[function(require,module,exports){
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

},{"../":1}]},{},[2]);
