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
