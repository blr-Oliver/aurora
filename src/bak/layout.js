window.addEventListener('load', function(){
  var sceneSize = getSceneDimensions();
  var html = document.getElementsByTagName('html')[0];
  var scene = createScene(sceneSize);

  function calculateFixedOffset(portSize, contentSize, elementSize, scroll){
    if(elementSize <= portSize)
      return (portSize - elementSize) / 2;
    if(contentSize < elementSize)
      contentSize = elementSize;
    return (portSize - elementSize) * scroll / (contentSize - portSize);
  }
  function calculateSceneBounds(element){
    return element.getBoundingClientRect();
  }

  var positioner = function(){
    var sceneBounds = calculateSceneBounds(scene);

    document.body.style.minHeight = scene.clientHeight + 'px';
    scene.style.left = calculateFixedOffset(html.clientWidth,
        document.body.scrollWidth,
        sceneBounds.width,
        window.scrollX)
        + 'px';
    scene.style.top = calculateFixedOffset(html.clientHeight,
        document.body.scrollHeight,
        sceneBounds.height,
        window.scrollY)
        + 'px';
  }
  window.addEventListener('scroll', positioner);
  window.addEventListener('resize', positioner);
  positioner();
});

function createScene(dimensions){
  var scene = createSVGElement('svg', {
    id: 'scene',
    viewBox: [0, 0, dimensions.width, dimensions.height].join(' ')
  });
  scene.style.minWidth = dimensions.width * 3 / 8 + 'px';
  document.body.style.minWidth = dimensions.width * 3 / 8 + 'px';
  document.body.appendChild(scene);
  scene.appendChild(createSVGElement('circle', {cx: 1280, cy: 1024, r: 500, fill: 'red'}));
  return scene;
}
function getSceneDimensions(){
  return {
    width: window.screen.width * 2,
    height: window.screen.height * 2
  };
}