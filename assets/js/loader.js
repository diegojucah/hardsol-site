/* ==========================================================================
   FrameLoader — carregamento "coarse-to-fine" da sequência do filme.
   Passes: 6 -> 3 -> 1. O filme só é liberado quando o passe de passo 1
   (sequência completa) termina, então NUNCA aparecem "buracos" com imagens
   distantes: o canvas só desenha o frame exato e, se ele não chegou, mantém o
   quadro anterior em tela (hold), sem pular para um vizinho.
   ========================================================================== */
(function (global) {
  "use strict";

  // Passes: 8 -> 4 -> 2 -> 1. O filme é liberado quando o passo 2 termina
  // (~metade dos frames): navegável rápido e sem buracos visíveis. O restante
  // completa em segundo plano. Se um frame ainda não chegou, o canvas MANTÉM o
  // quadro atual (hold) — nunca pula para um vizinho distante.
  var PASSES = [8, 4, 2, 1];
  var READY_AT = 2; // índice do passe de passo 2

  function FrameLoader(opts) {
    this.count = opts.count;
    this.dir = opts.dir;
    this.ext = opts.ext || "webp";
    this.pad = opts.pad || 4;
    this.concurrency = opts.concurrency || 8;
    this.onProgress = opts.onProgress || function () {};
    this.onPass = opts.onPass || function () {};
    this.onReady = opts.onReady || function () {};

    this.frames = new Array(this.count);
    this._loaded = 0;
    this._ready = false;
    this._started = false;
  }

  FrameLoader.prototype.src = function (i) {
    return this.dir + "/frame_" + String(i + 1).padStart(this.pad, "0") + "." + this.ext;
  };

  /** Frame pronto para desenho, ou null (para o chamador manter o quadro atual). */
  FrameLoader.prototype.get = function (i) {
    var img = this.frames[i];
    return img && img.complete && img.naturalWidth ? img : null;
  };

  FrameLoader.prototype.start = function () {
    if (this._started) return;
    this._started = true;

    var seen = Object.create(null);
    var order = [];
    for (var p = 0; p < PASSES.length; p++) {
      for (var i = 0; i < this.count; i += PASSES[p]) {
        if (!seen[i]) {
          seen[i] = true;
          order.push(i);
        }
      }
    }
    if (order[0] !== 0) {
      var idx = order.indexOf(0);
      if (idx > 0) {
        order.splice(idx, 1);
        order.unshift(0);
      }
    }

    this._queue = order;
    this._cursor = 0;
    this._passCounts = this._computePassCounts();
    this._passIndex = 0;
    for (var c = 0; c < this.concurrency; c++) this._pump();
  };

  FrameLoader.prototype._computePassCounts = function () {
    var counts = [];
    var total = 0;
    var seen = Object.create(null);
    for (var p = 0; p < PASSES.length; p++) {
      for (var i = 0; i < this.count; i += PASSES[p]) {
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
    img.onload = function () {
      self._loaded++;
      self._finishOne();
      self._pump();
    };
    img.onerror = function () {
      self._loaded++;
      self._finishOne();
      self._pump();
    };
    img.src = this.src(i);
    this.frames[i] = img;
  };

  FrameLoader.prototype._finishOne = function () {
    this.onProgress(this._loaded / this.count);
    while (this._passIndex < PASSES.length && this._loaded >= this._passCounts[this._passIndex]) {
      this.onPass(PASSES[this._passIndex]);
      if (this._passIndex >= READY_AT && !this._ready) {
        this._ready = true;
        this.onReady();
      }
      this._passIndex++;
    }
  };

  global.FrameLoader = FrameLoader;
})(window);
