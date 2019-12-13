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

  // rgb 函数
  let rgb = null;

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
   * @param {function} fn
   *
   * @return {void}
   */
  const init = fn => {
    rgb = fn();
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
        const rgbv = rgb(x, y, fno);
        data.data[start] = rgbv[0] & 255;
        data.data[start + 1] = rgbv[1] & 255;
        data.data[start + 2] = rgbv[2] & 255;
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

  const $fn = document.getElementById("fn");

  const $draw = document.getElementById("draw");
  const $play = document.getElementById("play");
  const $stop = document.getElementById("stop");

  const $save = document.getElementById("save");
  // const $load = document.getElementById("load");

  const makeFn = () => new Function($fn.value.trim());

  $draw.onclick = () => {
    bitmap.init(makeFn());
    bitmap.resetFno();
    bitmap.draw();
  };

  $play.onclick = () => {
    bitmap.init(makeFn());
    bitmap.play();
  };

  $stop.onclick = () => {
    bitmap.stop();
  };

  $save.onclick = async () => {
    const code = $fn.value.trim();

    const url = `${API_ROOT}/bitmap/save/`;
    const request = new Request(url);
    try {
      const response = await fetch(request, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({ code }),
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
      $fn.value = log.code;
    } catch (e) {
      alert(e.message);
    }
  };

  if (location.hash) loadItem(location.hash.split("?")[0].slice(1));
})();

},{"../":1}]},{},[2]);
