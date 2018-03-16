const STAR_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'];
window.addEventListener('load', createStars);

function createStars(){
  var parent = document.getElementById('sky');
  generateStarData(6000).forEach(d => renderStar(d, parent));
}

function generateStarData(n){
  var data = [], base = Math.ceil(Math.pow(n, 1 / STAR_SIZES.length)), lnBase = Math.log(base);
  var distribute = s => Math.min(STAR_SIZES.length - 1, Math.floor(Math.log(1 / (1 - s)) / lnBase));
  while(n-- >= 0){
    data.push({
      x: rnd(0, 1000, true),
      y: rnd(0, 1000, true),
      size: distribute(Math.random()),
      hue: rnd(0, 360, true)
    });
  }
  return data;
}

function renderStar(data, parent){
  var star = document.createElement('div');
  star.style.left = data.x / 10 + '%';
  star.style.top = data.y / 10 + '%';
  star.style.backgroundColor = 'hsl(' + data.hue + ', 100%, 90%)';
  star.className = 'star-' + STAR_SIZES[data.size];
  parent.appendChild(star);
}

function rnd(from, to, round){
  var value = Math.random() * (to - from) + from;
  if(round)
    value = Math.floor(value);
  return value;
}