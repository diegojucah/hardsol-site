/* ==========================================================================
   FrameLoader — carregamento "coarse-to-fine" da sequência do filme.
   Passes: 16 -> 8 -> 4 -> 2 -> 1. Após o primeiro passe o filme já é navegável;
   os passes seguintes só preenchem as lacunas.
   ========================================================================== */
(function (global) {
  "use strict";

  var PASSES = [16, 8, 4, 2, 1];

  function FrameLoader(opts) {
    this.count = opts.count;
    this.dir = opts.dir;
    this.ext = opts.ext || "webp";
    this.pad = opts.pad || 4;
    this.concurrency = opts.concurrency || 6;
    this.onProgress = opts.onProgress || function () {};
    this.onPass = opts.onPass || function () {};
    this.onReady = opts.onReady || function () {};

    this.frames = new Array(this.count);
    this._loaded = 0;
    this._ready = false;
    this._started = false;
  }

  FrameLoader.prototype.src = function (i) {
    return (
      this.dir + "/frame_" + String(i + 1).padStart(this.pad, "0") + "." + this.ext
    );
  };

  FrameLoader.prototype.start = function () {
    if (this._started) return;
    this._started = true;

    var seen = Object.create(null);
    var order = [];
    for (var p = 0; p < PASSES.length; p++) {
      var step = PASSES[p];
      for (var i = 0; i < this.count; i += step) {
        if (!seen[i]) {
          seen[i] = true;
          order.push(i);
        }
      }
    }
    // O frame 0 sempre primeiro (poster inicial).
    if (order[0] !== 0) {
      var idx = order.indexOf(0);
      if (idx > 0) order.splice(idx, 1), order.unshift(0);
    }

    this._queue = order;
    this._cursor = 0;
    this._passCounts = this._computePassCounts();
    this._passIndex = 0;
    for (var c = 0; c < this.concurrency; c++) this._pump();
  };

  // Total acumulado de frames ao fim de cada passe (para disparar onPass/onReady).
  FrameLoader.prototype._computePassCounts = function () {
    var counts = [];
    var total = 0;
    var seen = Object.create(null);
    for (var p = 0; p < PASSES.length; p++) {
      var step = PASSES[p];
      for (var i = 0; i < this.count; i += step) {
        if (!seen[i]) {
          seen[i] = true;
          total++;
        }
      }
      counts.push(total);
    }
    return counts;
  };

  FrameLoader.prototype._pump = function () {
    var self = this;
    if (this._cursor >= this._queue.length) return;
    var i = this._queue[this._cursor++];
    var img = new Image();
    img.decoding = "async";
    if (i === 0) img.fetchPriority = "high";
    img.onload = function () {
      self.frames[i] = img;
      self._loaded++;
      self._finishOne(i);
      self._pump();
    };
    img.onerror = function () {
      self._finishOne(i);
      self._pump();
    };
    img.src = this.src(i);
    this.frames[i] = img;
  };

  FrameLoader.prototype._finishOne = function () {
    this.onProgress(this._loaded / this.count);
    while (
      this._passIndex < PASSES.length &&
      this._loaded >= this._passCounts[this._passIndex]
    ) {
      this.onPass(PASSES[this._passIndex]);
      this._passIndex++;
      if (!this._ready) {
        this._ready = true;
        this.onReady();
      }
    }
  };

  // Retorna o frame carregado mais próximo de `i` (vizinho mais perto).
  FrameLoader.prototype.nearest = function (i) {
    if (this.frames[i] && this.frames[i].complete && this.frames[i].naturalWidth) {
      return this.frames[i];
    }
    for (var d = 1; d < this.count; d++) {
      var a = i - d;
      var b = i + d;
      if (a >= 0 && this.frames[a] && this.frames[a].naturalWidth) return this.frames[a];
      if (b < this.count && this.frames[b] && this.frames[b].naturalWidth) return this.frames[b];
    }
    return null;
  };

  global.FrameLoader = FrameLoader;
})(window);
