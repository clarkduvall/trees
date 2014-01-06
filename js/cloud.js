(function() {
  function Cloud(canvas, dropper, text) {
    var canvasWidth = canvas.width,
        numParts = Math.floor(Math.random() * 4 + 2),
        xOff;

    this.dropper = dropper;

    this.size = Math.random() * 50 + 150;
    this.x = Math.random() > 0.5 ? -this.size * 5 : canvasWidth + this.size * 5;
    this.y = Math.random() * canvas.height / 4;
    this.maxX = 0;
    this.minX = 0;

    if (text) {
      this.words = text.split('\n');
      this.size = 400;
      this.x = canvasWidth / 2;
      this.y = 200;
    }

    if (Math.random() > 0.8 && !text)
      this.color = _.random(180, 255);
    else
      this.color = 255;

    if (this.x < 0)
      this.dx = Math.random() * 50;
    else
      this.dx = -Math.random() * 50;

    if (text)
      this.dx = 40;

    this.canvasWidth = canvasWidth;

    this.parts = [{x: 0, y: 0, size: this.size}];

    for (var i = 0; i < numParts; ++i) {
      xOff = Math.random() * this.size - this.size / 2;
      xOff += (this.size / 4) * (xOff < 0 ? -1 : 1);
      if (xOff > this.maxX)
        this.maxX = xOff;
      if (xOff < this.minX)
        this.minX = xOff;
      this.parts.push({
        x: xOff,
        y: Math.random() * this.size / 2 - this.size / 4,
        size: Math.random() * this.size / 2 + this.size / 2
      });
    }

    this.parts = _.shuffle(this.parts);
  }

  Cloud.prototype.render = function(ctx) {
    var part,
        textOffset = -this.y + 50;

    ctx.save();
    ctx.translate(this.x, this.y);

    for (var i = 0; i < this.parts.length; ++i) {
      part = this.parts[i];
      ctx.save();
      ctx.translate(part.x, part.y);
      ctx.fillStyle = createRadialGradient(ctx, part.size,
          {r: this.color, g: this.color, b: this.color});
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 1;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, part.size / 2, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }

    if (this.words && this.words.length) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 5;
      ctx.fillStyle = 'white';//'rgba(0, 0, 0, 0.0)';
      ctx.font = '50px Varela Round';
      ctx.textAlign = 'center';
      for (var i = 0; i < this.words.length; ++i) {
        ctx.fillText(this.words[i], 0, textOffset);
        textOffset += 50;
      }
    }

    ctx.restore();
  };

  Cloud.prototype.update = function(delta) {
    this.x += this.dx * delta;

    if (Math.random() < (255 - this.color) * 0.005) {
      this.dropper.drop({
        x: this.x + _.random(this.minX, this.maxX),
        y: this.y,
        dx: this.dx
      });
    }

    return (this.dx >= 0 && this.x - this.size > this.canvasWidth) ||
        (this.dx < 0 && this.x + this.size < 0);
  };

  window.Cloud = Cloud;
})();
