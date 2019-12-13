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
    for (let y = yr[0]; y < yr[1]; y += 1) {
      for (let x = xr[0]; x < xr[1]; x += 1) {
        const start = 4 * (y * width + x);
        data.data[start] = this.red(x, y, fno) & 255;
        data.data[start + 1] = this.green(x, y, fno) & 255;
        data.data[start + 2] = this.blue(x, y, fno) & 255;
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
