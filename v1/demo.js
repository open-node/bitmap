(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * @param {dom} canvas canvas dom object
 * @class
 * @return {Bitmap} Instance
 */
function Bitmap(canvas) {
  // 帧计数器
  let fno = 1;

  // 动画是否执行中
  let animating = false;

  const ctx = canvas.getContext("2d");
  const { height, width } = canvas;
  const xr = [0 - (width >> 1), width >> 1];
  const yr = [0 - (height >> 1), height >> 1];

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
    let start = 0;
    for (let y = yr[0]; y < yr[1]; y += 1) {
      for (let x = xr[0]; x < xr[1]; x += 1) {
        data.data[start] = this.red(x, y, fno) & 255;
        data.data[start + 1] = this.green(x, y, fno) & 255;
        data.data[start + 2] = this.blue(x, y, fno) & 255;
        start += 4;
      }
    }
    ctx.putImageData(data, 0, 0, 0, 0, width, height);

    if (animating) {
      fno += 1;
      requestAnimationFrame(draw);
    }
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
   * 重置帧计数
   * @memberof Bitmap
   * @instance
   *
   * @return {void}
   */
  const resetFno = () => {
    fno = 1;
  };

  /**
   * 动画绘制关闭
   * @memberof Bitmap
   * @instance
   *
   * @return {void}
   */
  const stop = () => {
    animating = false;
  };

  return { init, draw, play, stop, resetFno };
}

module.exports = Bitmap;

},{}],2:[function(require,module,exports){
const Bitmap = require("../");

const dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const random = len => {
  const { length } = dict;
  let ret = "";
  for (let i = 0; i < len; i += 1) ret += dict[(Math.random() * length) | 0];

  return ret;
};

const API_ROOT =
  "https://1360695010715089.cn-shenzhen.fc.aliyuncs.com/2016-08-15/proxy";

(() => {
  const uid = localStorage.uuid || random(32);
  if (!localStorage.uuid) localStorage.uuid = uid;
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("X-Auth-UUID", uid);

  const canvas = document.getElementById("my-canvas");
  const bitmap = Bitmap(canvas);
  window.bitmap = bitmap;

  const $red = document.getElementById("red");
  const $green = document.getElementById("green");
  const $blue = document.getElementById("blue");

  const $draw = document.getElementById("draw");
  const $play = document.getElementById("play");
  const $stop = document.getElementById("stop");

  const $save = document.getElementById("save");
  const $load = document.getElementById("load");

  const getFns = () => {
    const red = new Function("x", "y", "f", $red.value.trim());
    const green = new Function("x", "y", "f", $green.value.trim());
    const blue = new Function("x", "y", "f", $blue.value.trim());

    return { red, green, blue };
  };

  $draw.onclick = () => {
    const { red, green, blue } = getFns();
    bitmap.init(red, green, blue);
    bitmap.resetFno();
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

  $save.onclick = async () => {
    const red = $red.value.trim();
    const green = $green.value.trim();
    const blue = $blue.value.trim();

    const url = `${API_ROOT}/bitmap/save/`;
    const request = new Request(url);
    try {
      const response = await fetch(request, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ red, green, blue }),
        headers
      });

      const log = await response.json();
      location.hash = log.id;
    } catch (e) {
      alert(e.message);
    }
  };

  const loadItem = async id => {
    const url = `${API_ROOT}/bitmap/item/?id=${id}`;
    const request = new Request(url);
    try {
      const response = await fetch(request, {
        method: "GET",
        mode: "cors",
        headers
      });

      const log = await response.json();
      if (400 <= response.status) {
        location.hash = "";
        throw Error(log.message || response.statusText);
      }
      $red.value = log.red;
      $green.value = log.green;
      $blue.value = log.blue;
    } catch (e) {
      alert(e.message);
    }
  };

  if (location.hash) loadItem(location.hash.split("?")[0].slice(1));
})();

},{"../":1}]},{},[2]);
