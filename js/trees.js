$(function() {
  var $canvas = $('#canvas'),
      canvas = $canvas[0],
      ctx = canvas.getContext('2d'),
      width = $canvas.width(),
      height = $canvas.height(),
      requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;

  canvas.width = width;
  canvas.height = height;

  (function run() {
    var forest = new Forest(),
        dropper = new Dropper(canvas, forest),
        sky = new Sky(canvas, dropper),
        lastStep = 0,
        numTrees = 1;

    function resetTrees() {
      forest.clearTrees();
      for (var i = 0; i < numTrees; ++i) {
        forest.addTree({
          x: (i + 1) * width / (numTrees + 1),
          y: height,
          size: 5,
          scale: Math.min(0.6, 1 / numTrees)
        });
      }
    }

    $('input#num-trees').change(function() {
      numTrees = parseInt($(this).val(), 10);
      resetTrees();
    });

    resetTrees();

    function step(ms) {
      var delta = (ms - lastStep) * 0.001;
      lastStep = ms;

      if (delta > 1) {
        requestAnimationFrame(step);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      sunset(ctx);

      forest.render(ctx);
      dropper.render(ctx);
      sky.render(ctx);

      forest.update(delta);
      dropper.update(delta);
      sky.update(delta);

      ctx.restore();

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  })();
});
