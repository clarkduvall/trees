(function() {
  function Dropper(canvas, forest) {
    var $canvas = $(canvas),
        that = this;

    this.mouseCoords = {x: 0, y: 0};
    this.mouseDown = false;
    this.drops = [];
    this.canvas = canvas;
    this.forest = forest;

    $canvas.mousedown(function(e) {
      that.mouseDown = true;
      that.mouseCoords = getCoordsFromEvent(e, canvas);
      e.preventDefault();
    }).mouseup(function() {
      that.mouseDown = false;
    }).mousemove(function(e) {
      that.mouseCoords = getCoordsFromEvent(e, canvas);
      e.preventDefault();
    });

    this.dropCounter = 0;
  }

  Dropper.prototype.render = function(ctx) {
    for (var i = 0; i < this.drops.length; ++i)
      this.drops[i].render(ctx);
  };

  Dropper.prototype.drop = function(opts) {
    opts.maxHeight = this.canvas.height;
    this.drops.push(new Drop(opts));
  };

  Dropper.prototype.update = function(delta, ctx) {
    var toDelete = [];

    this.dropCounter += delta;

    for (var i = 0; i < this.drops.length; ++i) {
      if (this.drops[i].fall(delta, this.forest))
        toDelete.push(this.drops[i]);
    }

    this.drops = _.difference(this.drops, toDelete);

    if (!this.mouseDown) return;

    if (this.dropCounter > 0.1) {
      this.drop({x: this.mouseCoords.x, y: this.mouseCoords.y});
      this.dropCounter = 0;
    }
  };

  window.Dropper = Dropper;
})();
