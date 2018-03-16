function Scene(options){
  this.options = options;
  this.listeners = {};
}

Scene.prototype = {
  computeDimensions: function(){
    this.innerWidth = screen.width * 2;
    this.innerHeight = screen.height * 2;
  },
  create: function(){
    this.dispose();
    this.computeDimensions();
    this.createContainer();
    this.createStarsAndSunset();
    this.createAurora();
    this.createMountains();
  },
  dispose: function(){
    if(this.listeners.scenePosition){
      window.removeEventListener('resize', this.listeners.scenePosition);
      window.removeEventListener('scroll', this.listeners.scenePosition);
      delete this.listeners.scenePosition;
    }
  },
  createContainer: function(){
    var html = document.getElementsByTagName('html')[0];
    var display = document.getElementById('display');
    var starCanvas = document.getElementById('starCanvas');
    var scene = document.getElementById('scene');
    
    scene.setAttribute('viewBox', [0, 0, this.innerWidth, this.innerHeight].join(' '));
    document.body.style.minWidth = display.style.minWidth = this.innerWidth * 3 / 8 + 'px';

    function calculateFixedOffset(portSize, contentSize, elementSize, scroll){
      if(elementSize <= portSize)
        return (portSize - elementSize) / 2;
      if(contentSize < elementSize)
        contentSize = elementSize;
      return (portSize - elementSize) * scroll / (contentSize - portSize);
    }
    
    this.listeners.scenePosition = function(){
      var sceneBounds = scene.getBoundingClientRect();

      document.body.style.minHeight = sceneBounds.height + 'px';
      display.style.left = calculateFixedOffset(html.clientWidth,
          document.body.scrollWidth,
          sceneBounds.width,
          window.scrollX)
          + 'px';
      display.style.top = calculateFixedOffset(html.clientHeight,
          document.body.scrollHeight,
          sceneBounds.height,
          window.scrollY)
          + 'px';
    };
    
    window.addEventListener('scroll', this.listeners.scenePosition);
    window.addEventListener('resize', this.listeners.scenePosition);
    this.listeners.scenePosition();
  },
  createStarsAndSunset: function(){
    var config = this.configureStarCanvas();
    var data = this.createStarData(config);
    this.drawStars(data, config);
    var sunsetHolder = document.getElementById('sunset-holder');
    sunsetHolder.style.height = (config.midY / this.innerHeight - 0.95) * 200 + '%';
  },
  configureStarCanvas: function(){
    var midX = randomIntBetween(0, this.innerWidth - 1);
    var midY = randomIntBetween(this.innerHeight * 1.1, this.innerHeight * 1.3);
    var r = Math.max(Math.hypot(midX, midY), Math.hypot(this.innerWidth - midX, midY));
    var
      minX = Math.floor(midX - r),
      maxX = Math.ceil(midX + r),
      minY = Math.floor(midY - r),
      maxY = Math.ceil(midY + r);
    var bounds = {
        minX: minX,
        midX: midX,
        maxX: maxX,
        minY: minY,
        midY: midY,
        maxY: maxY,
        r: r,
        width: maxX - minX + 1,
        height: maxY - minY + 1,
    };
    var canvas = document.getElementById('stars');
    canvas.style.width = bounds.width / this.innerWidth * 100 + '%'; 
    canvas.style.height = bounds.height / this.innerHeight * 100 + '%';
    canvas.style.left = bounds.minX / this.innerWidth * 100 + '%';
    canvas.style.top = bounds.minY / this.innerHeight * 100 + '%';
    return bounds;
  },
  createStarData: function(config){
    const sizes_count = 5;

    var data = [], base = Math.ceil(Math.pow(this.options.starCount, 1 / sizes_count)), lnBase = Math.log(base);
    var distribute = s => Math.min(sizes_count - 1, Math.floor(Math.log(1 / (1 - s)) / lnBase));
    while(data.length < this.options.starCount){
      var x = randomIntBetween(config.minX, config.maxX);
      var y = randomIntBetween(config.minY, config.maxY);
      var d = Math.hypot(x - config.midX, y - config.midY);
      if(d <= config.r){
        data.push({
          d: Math.floor(d),
          x: x,
          y: y,
          size: distribute(Math.random()),
          hue: randomInt(360)
        });
      }
    }
    data.sort((a,b) => (a.size - b.size) || (b.d - a.d));
    return data;
  },
  drawStars: function(data, bounds){
    const STAR_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
    var canvas = document.getElementById('stars');
    canvas.innerHTML = '';
    data.forEach(star => drawStar(star));
    function drawStar(star){
      var item = document.createElement('div');
      item.style.backgroundColor = "hsl(" + star.hue + ", 100%, 92%)";
      item.style.left = (star.x - bounds.minX) / bounds.width * 100 + '%';
      item.style.top = (star.y - bounds.minY) / bounds.height * 100 + '%';
      item.classList.add(STAR_SIZES[star.size]);
      canvas.appendChild(item);
    }
  },
  createAurora: function(){},
  createMountains: function(){
    var mountains = document.getElementById('mountains');
    removeAll(mountains);
    for(var i = 0; i < this.options.mountainCount; ++i)
      mountains.appendChild(this.generateMountains(this.getMountainOptions(i, this.options.mountainCount)));
  },
  generateEdge: function(below, slope, xStart, yStart, xEnd, yEnd){
    var x, y, maxSlope = slope * 3, t;
    var
      xMin = Math.max(xStart + maxSlope, xStart + (xEnd - xStart) / 4),
      xMax = Math.min(xEnd - maxSlope, xEnd - (xEnd - xStart) / 4);
    if(xMin >= xMax) return [];
    do{
      x = randomIntBetween(xMin, xMax);
      t = (x - xStart) / (xEnd - xStart);
      y = yStart + (yEnd - yStart) * t;
      var leftRange = below ? [Math.ceil(y + (x - xStart) / maxSlope), Math.floor(y + (x - xStart) / slope)] : [Math.ceil(y - (x - xStart) / slope), Math.floor(y - (x - xStart) / maxSlope)];
      var rightRange = below ? [Math.ceil(y + (xEnd - x) / maxSlope), Math.floor(y + (xEnd - x) / slope)] : [Math.ceil(y - (xEnd - x) / slope), Math.floor(y - (xEnd - x) / maxSlope)];
      var intersection = this.intersectRanges(leftRange, rightRange);
      if(intersection[0] <= intersection[1])
        y = randomIntBetween(...intersection);
      else y = NaN;
    }while(!y);
    var slopeLeft = slope * Math.pow(1.5, (1 - t) / t), slopeRight = slope * Math.pow(1.5, t / (1 - t));
    var result = [];
    if(slopeLeft * 2 + 1 < x - xStart)
      result.push(...this.generateEdge(!below, slopeLeft, xStart, yStart, x, y));
    result.push(x, y);
    if(slopeRight * 2 + 1 < xEnd - x)
      result.push(...this.generateEdge(!below, slopeRight, x, y, xEnd, yEnd));
    return result;

  },
  intersectRanges: function(r1, r2){
    return [Math.max(r1[0], r2[0]), Math.min(r1[1], r2[1])];
  },
  generateMountains: function(options){
    var
      sw = this.innerWidth, sh = this.innerHeight,
      yStart = randomInt(options.bandHeight * sh),
      yEnd = randomInt(options.bandHeight * sh);
    var edge = [0, yStart, ...this.generateEdge(options.below, options.slope, 0, yStart, sw - 1, yEnd), sw - 1, yEnd];
    var edgeHeight = edge.reduce((r, y, i) => (i & 1 ? {min: Math.min(r.min, y), max: Math.max(r.max, y)} : r), {min: Infinity, max: -Infinity});
    var offset = Math.round(options.horizon * sh) - ((edgeHeight.max + edgeHeight.min) >> 1);
    var path = ['M0', sh - 1, 'L', ...edge.map((y, i) => (i & 1 ? y + offset : y)), sw - 1, sh - 1, 'Z'].join(' ');
    return createSVGElement('path', {
      d: path,
      fill: ['hsl(', options.color.h, ', ', options.color.s, '%, ', options.color.l, '%)'].join('')
    });
  },
  getMountainOptions: function(index, n){
    return {
      bandHeight: 0.1, 
      below: !!(index & 1), 
      slope: 1.5 + 3 * index / (n - 1),
      horizon: 0.85 + 0.1 * (index >> 1) / ((n - 1) >> 1),
      color: {
        h: Math.round(220 - 40 * index / (n - 1)),
        s: 20,
        l: Math.round(10 - 8 * index / (n - 1))
      }
    }
  }
}

window.addEventListener('load', function(){
  new Scene({
    id: 'scene',
    starCount: 6000,
    mountainCount: 6
  }).create();
  var points = [[[5, 10], [6, 3], [9, 2], [14, 3]],
                [[5, 10], [8, 10], [12, 7], [14, 3]]];
  var duration = 4000;
  requestAnimationFrame(function drawFrame(now){
    var t = now % (duration * 2) / duration;
    t = 1 - Math.abs(1 - t);
    t = (Math.cbrt(1 - 2*t) + 1) / 2;
    var result = points[0].map((p, i) => [p[0] + (points[1][i][0] - p[0])*t, p[1] + (points[1][i][1] - p[1])*t]);
    var path = ["M",  result[0][0].toFixed(2), result[0][1].toFixed(2),
                "C",  result[1][0].toFixed(2), result[1][1].toFixed(2),
                      result[2][0].toFixed(2), result[2][1].toFixed(2),
                      result[3][0].toFixed(2), result[3][1].toFixed(2)].join(' ');
    document.getElementById('sample').setAttribute('d', path);
    requestAnimationFrame(drawFrame);
  });
})