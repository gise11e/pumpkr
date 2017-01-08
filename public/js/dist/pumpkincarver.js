var pumpkinCarver = {

  config: {
    translatedWidth: 40,
    translatedHeight: 40,
    canvasWidth: 600,
    canvasHeight: 600,
    pixelSize: 10,
    skinImgSrc: imageStr,
    bgImgSrc: bgStr
  },

  _getPosition : function(e) {
    var canvasX = Math.floor(parseInt(e.clientX - this._offsetX) / this.config.pixelSize) * this.config.pixelSize;
    var canvasY = Math.floor(parseInt(e.clientY - this._offsetY) / this.config.pixelSize) * this.config.pixelSize;
    return {
      canvasX: canvasX,
      canvasY: canvasY,
      translatedX: canvasX / this.config.pixelSize,
      translatedY: canvasY / this.config.pixelSize
    };
  },

  _handleMouseDown : function(e) {
    var position = this._getPosition(e);

    this._carvePixel(position);

    this._lastX = position.canvasX;
    this._lastY = position.canvasY;

    this._isMouseDown = true;
  },
  _handleMouseMove : function(e){
    var position = this._getPosition(e);

    if(this._isMouseDown && (this._lastX != position.canvasX || this._lastY != position.canvasY)) {
      this._carvePixel(position);
    }
    this._lastX = position.canvasX;
    this._lastY = position.canvasY;
  },
  _handleMouseUp : function(e) {
    this._isMouseDown=false;
  },
  _handleMouseOut : function(e) {
    this._isMouseDown=false;
  },

  init : function() {

    this._canvas = $('#canvas');
    this._canvasOffset = this._canvas.offset();
    this._offsetX = this._canvasOffset.left;
    this._offsetY = this._canvasOffset.top;
    this._ctx = this._canvas[0].getContext("2d");
    this._isMouseDown = false;

    this._canvas.on('mousedown', this._handleMouseDown.bind(this));
    this._canvas.on('mousemove', this._handleMouseMove.bind(this));
    this._canvas.on('mouseup', this._handleMouseUp.bind(this));
    this._canvas.on('mouseout', this._handleMouseOut.bind(this));

    this._pixels = [];
    for (var i=0; i<this.config.translatedWidth*this.config.translatedHeight; i++) {
      this._pixels[i] = 0;
    }

    this._skinImg = new Image(this.config.canvasWidth, this.config.canvasHeight);
    this._skinImg.src = this.config.skinImgSrc;
    this._skinImg.onload = this.reset.bind(this);
  },

  reset : function() {
    for (var i=0; i<this._pixels.length; i++) {
      this._pixels[i] = 0;
    }
    this._ctx.globalCompositeOperation = 'source-over';
    this._ctx.clearRect(0, 0, 400, 400);
    this._ctx.drawImage(this._skinImg, 0, 0, 400, 400);
    this._ctx.globalCompositeOperation="destination-out";
  },

  _getPixelIndex : function(translatedX, translatedY) {
    return (translatedY * this.config.translatedHeight) + translatedX;
  },

  _getPixelCoordinate : function(index) {
    var x = this.config.pixelSize * (index % this.config.translatedWidth);
    var y = this.config.pixelSize * Math.floor(index / this.config.translatedHeight);
    return [x, y];
  },

  _drawPixel : function (x, y, opacity) {
    opacity = (typeof opacity === 'undefined') ? 0.5 : opacity;

    this._ctx.beginPath();
    this._ctx.globalCompositeOperation = "destination-out";
    this._ctx.fillStyle = "rgba(0,0,0," + opacity + ")";
    this._ctx.rect(x, y, this.config.pixelSize, this.config.pixelSize);
    this._ctx.fill();
  },

  _carvePixel : function(position) {
    var index = this._getPixelIndex(position.translatedX, position.translatedY);
    if (this._pixels[index] == 2) {
      return false;
    }
    this._pixels[index]++;
    this._drawPixel(position.canvasX, position.canvasY);
  },

  exportString : function() {
    return this._pixels.join('');
  },

  exportPreview : function () {
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = 200;
    tmpCanvas.height = 200;
    var tmpCtx = tmpCanvas.getContext('2d');
    var bgImg = new Image(400, 400);
    bgImg.src = this.config.bgImgSrc;
    var exportedImg = new Image(400, 400);
    exportedImg.src = this._canvas[0].toDataURL();

    tmpCtx.drawImage(bgImg, 0, 0, 200, 200);
    // this._ctx.globalCompositeOperation = 'source-over';
    tmpCtx.drawImage(exportedImg, 0, 0, 200, 200);

    return tmpCanvas.toDataURL();
  },

  exportComplete : function() {
    return {
      pixels: this.exportString(),
      preview: this.exportPreview()
    };
  },

  loadFromString : function(serialized) {
    this.reset();
    for (var i=0; i<serialized.length; i++) {
      var value = parseInt(serialized[i]);
      this._pixels[i] = Math.min(value, 2);
      if (value) {
        var coord = this._getPixelCoordinate(i);
        this._drawPixel(coord[0], coord[1], (value * 0.5));
      }
    }
  }

};
