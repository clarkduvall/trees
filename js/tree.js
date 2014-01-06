(function() {
  var MAX_DEPTH = 3,
      MAX_SIZE = 100,
      NEW_BRANCH = 20;

  function Tree(opts) {
    opts = opts || {};
    this.parent = opts.parent;

    if (this.parent) {
      this.depth = this.parent.depth + 1;
      this.scale = this.parent.scale;
    } else {
      this.depth = 0;
      this.scale = opts.scale || 1;
    }

    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.heightOnParent = opts.heightOnParent;
    this.left = opts.left;
    this.size = opts.size || 1;
    this.newBranchSize = NEW_BRANCH * this.scale;
    this.branches = [];
    this.angle = Math.random() * 50 + 10;
    this.maxSize = MAX_SIZE * MAX_DEPTH * this.scale * 5;

    this.life = 1;

    this.leafRGB = {
      r: Math.floor(Math.random() * 20),
      g: Math.floor(Math.random() * 50 + 200),
      b: Math.floor(Math.random() * 20)
    };

    this.brownRGB = {
      r: Math.floor(Math.random() * 128 + 128),
      g: Math.floor(Math.random() * 64 + 64),
      b: Math.floor(Math.random() * 32 + 32)
    };

    this.cachedCanvas = $('<canvas></canvas>')[0];
    this.cachedCtx = this.cachedCanvas.getContext('2d');
    this.cachedCanvas.width = this.maxSize;
    this.cachedCanvas.height = this.maxSize;

    this.$this = $(this);

    this.$this.on('hit', function(e, data) {
      this.water(1 + data.speed / 2);
    });
  }

  Tree.prototype.getLife = function() {
    if (this.parent)
      return this.parent.getLife();
    return this.life;
  };

  Tree.prototype.blendColor = function() {
    var gLife = this.getLife(),
        bLife = 1 - gLife,
        r = gLife * this.leafRGB.r + bLife * this.brownRGB.r,
        g = gLife * this.leafRGB.g + bLife * this.brownRGB.g,
        b = gLife * this.leafRGB.b + bLife * this.brownRGB.b;
    return {r: r, g: g, b: b};
  };

  Tree.prototype.trigger = function(eventType, data) {
    this.$this.trigger(eventType, data);
  };

  Tree.prototype.isInTree = function(x, y) {
    var thisX = this.x - this.maxSize / 2,
        thisY = this.y - this.maxSize,
        pixel;

    if (x > thisX && x < thisX + this.maxSize &&
        y > thisY && y < thisY + this.maxSize) {
      pixel = this.cachedCtx.getImageData(x - thisX, y - thisY, 1, 1).data;
      return pixel[3] > 0;
    }
    return false;
  };

  Tree.prototype.cachedRender = function(ctx) {
    this.cachedCtx.clearRect(0, 0, this.maxSize, this.maxSize);

    this.cachedCtx.save();
    this.cachedCtx.translate(this.maxSize / 2, this.maxSize);
    this.renderToCanvas(this.cachedCtx);
    this.cachedCtx.restore();

    ctx.drawImage(this.cachedCanvas, this.x - this.maxSize / 2,
        this.y - this.maxSize);
  };

  Tree.prototype.addBranch = function(opts) {
    opts.parent = this;
    this.branches.push(new Tree(opts));
  };

  Tree.prototype.sprout = function() {
    this.addBranch({
      heightOnParent: Math.random() * 0.1 + 0.5,
      left: Math.random() > 0.5
    });
  };

  Tree.prototype.water = function(amount) {
    if (this.parent)
      this.parent.water(amount);
    else
      this.life = Math.min(1, this.life + amount * 0.1);
  };

  Tree.prototype.grow = function(delta, giveLife) {
    var maxSize = this.parent ? this.parent.size * 0.8 :
            (MAX_SIZE * this.scale),
        growthRate = this.getLife() * delta * 5;
    this.size = Math.min(this.size + growthRate * this.scale, maxSize);

    if (!this.parent)
      this.life = Math.max(0, this.life - delta * 0.1);

    if (Math.floor(this.size) >= this.newBranchSize *
          (this.branches.length + 1) && this.depth < MAX_DEPTH) {
      this.sprout();
    }

    for (var i = 0; i < this.branches.length; ++i)
      this.branches[i].grow(delta);
  };

  Tree.prototype.render = function(ctx) {
    if (this.parent) {
      ctx.save();
      ctx.translate(this.x, this.y);
      this.renderToCanvas(ctx);
      ctx.restore();
    } else {
      this.cachedRender(ctx);
    }
  };

  Tree.prototype.renderToCanvas = function(ctx) {
    var halfSize = this.size / 2,
        height = -this.size * 5,
        leafSize = this.size * 2,
        branch;

    ctx.fillStyle = createTrunkGradient(ctx, this.size);
    ctx.fillRect(-halfSize, 0, this.size, height);

    ctx.save();
    ctx.translate(0, height);
    ctx.fillStyle = createRadialGradient(ctx, leafSize, this.blendColor());
    ctx.beginPath();
    ctx.arc(0, 0, leafSize, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

    for (var i = 0; i < this.branches.length; ++i) {
      branch = this.branches[i];

      ctx.save();
      ctx.translate(0, height * branch.heightOnParent);
      if (branch.left)
        ctx.rotate(-this.angle * Math.PI / 180);
      else
        ctx.rotate(this.angle * Math.PI / 180);
      branch.render(ctx);
      ctx.restore();
    }
  };

  window.Tree = Tree;
})();
