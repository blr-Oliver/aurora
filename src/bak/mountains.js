const SVG_NS = "http://www.w3.org/2000/svg";
window.addEventListener('load', function(){
  createMountains(2560, 2048);
});

function generateEdge(below, slope, xStart, yStart, xEnd, yEnd){
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
    var intersection = intersectRanges(leftRange, rightRange);
    if(intersection[0] <= intersection[1])
      y = randomIntBetween(...intersection);
    else y = NaN;
  }while(!y);
  var slopeLeft = slope * Math.pow(1.5, (1 - t) / t), slopeRight = slope * Math.pow(1.5, t / (1 - t));
  var result = [];
  if(slopeLeft * 2 + 1 < x - xStart)
    result.push(...generateEdge(!below, slopeLeft, xStart, yStart, x, y));
  result.push(x, y);
  if(slopeRight * 2 + 1 < xEnd - x)
    result.push(...generateEdge(!below, slopeRight, x, y, xEnd, yEnd));
  return result;

  function intersectRanges(r1, r2){
    return [Math.max(r1[0], r2[0]), Math.min(r1[1], r2[1])];
  }
}

function createMountains(sceneWidth, sceneHeight){
  const n = 4;
  var mountains = document.getElementById('mountains');
  removeAll(mountains);
  for(var i = 0; i < n; ++i)
    mountains.appendChild(generateMountains(sceneWidth, sceneHeight, getMountainOptions(i, n)));
}

function getMountainOptions(index, n){
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

function generateMountains(sceneWidth, sceneHeight, options){
  var
    yStart = randomInt(options.bandHeight * sceneHeight),
    yEnd = randomInt(options.bandHeight * sceneHeight);
  var edge = [0, yStart, ...generateEdge(options.below, options.slope, 0, yStart, sceneWidth - 1, yEnd), sceneWidth - 1, yEnd];
  var edgeHeight = edge.reduce((r, y, i) => (i & 1 ? {min: Math.min(r.min, y), max: Math.max(r.max, y)} : r), {min: Infinity, max: -Infinity});
  var offset = Math.round(options.horizon * sceneHeight) - ((edgeHeight.max + edgeHeight.min) >> 1);
  var path = ['M0', sceneHeight - 1, 'L', ...edge.map((y, i) => (i & 1 ? y + offset : y)), sceneWidth - 1, sceneHeight - 1, 'Z'].join(' ');
  return createSVGElement('path', {
    d: path,
    fill: ['hsl(', options.color.h, ', ', options.color.s, '%, ', options.color.l, '%)'].join('')
  });
}

function removeAll(parent, node){
  while(node = parent.lastChild) node.remove();
}

function createSVGElement(name, props, ...classes){
  var element = document.createElementNS(SVG_NS, name);
  props && Object.keys(props).forEach(key => element.setAttributeNS(null, key, props[key]));
  classes && classes.forEach(c => element.classList.add(c));
  return element;
}

function randomInt(n){
  return Math.floor(Math.random() * n);
}
function randomIntBetween(from, to){
  return randomInt(Math.floor(to) - Math.ceil(from) + 1) + Math.ceil(from);
}