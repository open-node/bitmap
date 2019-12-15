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
    bitmap.stop();
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
