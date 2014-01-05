(function() {
  function Forest() {
    this.trees = [];
  }

  Forest.prototype.render = function(ctx) {
    for (var i = 0; i < this.trees.length; ++i)
      this.trees[i].render(ctx);
  };

  Forest.prototype.update = function(delta) {
    for (var i = 0; i < this.trees.length; ++i)
      this.trees[i].grow(delta);
  };

  Forest.prototype.addTree = function(opts) {
    this.trees.push(new Tree(opts));
  };

  Forest.prototype.clearTrees = function() {
    this.trees.length = 0;
  };

  Forest.prototype.getHitTree = function(x, y) {
    for (var i = 0; i < this.trees.length; ++i) {
      if (this.trees[i].isInTree(x, y))
        return this.trees[i];
    }
    return null;
  };

  window.Forest = Forest;
})();
