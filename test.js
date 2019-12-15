return (x, y, f, rgbv) => {
  if (x === 0 || y === 0) {
    rgbv[0] = 0;
    rgbv[1] = 0;
    rgbv[2] = 0;
  }
};
