function sunset(ctx) {
  var grd = ctx.createLinearGradient(0, ctx.canvas.height, 0, 0);
  grd.addColorStop(0.2, '#DDFFFF');
  grd.addColorStop(1, '#C6DEFF');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function floatToFixed(val) {
  if (!_.isNumber(val))
    val = parseFloat(val, 10);
  return val.toFixed(3);
}

function rgb(r, g, b, a) {
  if (_.isUndefined(a))
    a = 1;
  return 'rgba(' + Math.floor(r) + ',' + Math.floor(g) + ',' +
      Math.floor(b) + ',' + floatToFixed(a) + ')';
}

function darken(r, g, b, a) {
  return rgb(Math.min(255, r * 1.1), Math.min(255, g * 1.1),
      Math.min(255, b * 1.1), a);
}

function lighten(r, g, b, a) {
  return rgb(r * 0.9, g * 0.9, b * 0.9, a);
}

function createTrunkGradient(ctx, size) {
  var trunkGrd = ctx.createLinearGradient(-size / 2, 0, size / 2, 0);
  trunkGrd.addColorStop(0, '#C4810E');
  trunkGrd.addColorStop(0.5, '#D68D0F');
  trunkGrd.addColorStop(1, '#C4810E');
  return trunkGrd;
}

function createRadialGradient(ctx, size, rgbVals, alpha) {
    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size),
        r = rgbVals.r,
        g = rgbVals.g,
        b = rgbVals.b;
    gradient.addColorStop(0, rgb(r, g, b, alpha));
    gradient.addColorStop(1, lighten(r, g, b, alpha));
    return gradient;
}

function createRadialGradientToTransparent(ctx, size, rgbVals, alpha) {
    var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size),
        r = rgbVals.r,
        g = rgbVals.g,
        b = rgbVals.b;
    gradient.addColorStop(0, rgb(r, g, b, alpha));
    gradient.addColorStop(1, rgb(r, g, b, 0.0));
    return gradient;
}

function getCoordsFromEvent(e, canvas) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}
