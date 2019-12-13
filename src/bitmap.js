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
