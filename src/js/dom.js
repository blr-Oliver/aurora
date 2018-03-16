const SVG_NS = "http://www.w3.org/2000/svg";

function removeAll(parent, node){
  while(node = parent.lastChild) node.remove();
}

function createSVGElement(name, props, styles, ...classes){
  var element = document.createElementNS(SVG_NS, name);
  props && Object.keys(props).forEach(key => element.setAttributeNS(null, key, props[key]));
  styles && Object.keys(styles).forEach(style => element.style[style] = style);
  classes && classes.forEach(c => element.classList.add(c));
  return element;
}
