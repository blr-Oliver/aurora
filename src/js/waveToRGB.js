var xyzTable = {
  "start": 380,
  "step": 5,
  "data": [[0.1741, 0.005, 0.8209], [0.174, 0.005, 0.821], [0.1738, 0.0049, 0.8213], [0.1736, 0.0049, 0.8215],
      [0.1733, 0.0048, 0.8219], [0.173, 0.0048, 0.8222], [0.1726, 0.0048, 0.8226], [0.1721, 0.0048, 0.8231],
      [0.1714, 0.0051, 0.8235], [0.1703, 0.0058, 0.8239], [0.1689, 0.0069, 0.8242], [0.1669, 0.0086, 0.8245],
      [0.1644, 0.0109, 0.8247], [0.1611, 0.0138, 0.8251], [0.1566, 0.0177, 0.8257], [0.151, 0.0227, 0.8263],
      [0.144, 0.0297, 0.8263], [0.1355, 0.0399, 0.8246], [0.1241, 0.0578, 0.8181], [0.1096, 0.0868, 0.8036],
      [0.0913, 0.1327, 0.776], [0.0687, 0.2007, 0.7306], [0.0454, 0.295, 0.6596], [0.0235, 0.4127, 0.5638],
      [0.0082, 0.5384, 0.4534], [0.0039, 0.6548, 0.3413], [0.0139, 0.7502, 0.2359], [0.0389, 0.812, 0.1491],
      [0.0743, 0.8338, 0.0919], [0.1142, 0.8262, 0.0596], [0.1547, 0.8059, 0.0394], [0.1929, 0.7816, 0.0255],
      [0.2296, 0.7543, 0.0161], [0.2658, 0.7243, 0.0099], [0.3016, 0.6923, 0.0061], [0.3373, 0.6589, 0.0038],
      [0.3731, 0.6245, 0.0024], [0.4087, 0.5896, 0.0017], [0.4441, 0.5547, 0.0012], [0.4788, 0.5202, 0.001],
      [0.5125, 0.4866, 0.0009], [0.5448, 0.4544, 0.0008], [0.5752, 0.4242, 0.0006], [0.6029, 0.3965, 0.0006],
      [0.627, 0.3725, 0.0005], [0.6482, 0.3514, 0.0004], [0.6658, 0.334, 0.0002], [0.6801, 0.3197, 0.0002],
      [0.6915, 0.3083, 0.0002], [0.7006, 0.2993, 0.0001], [0.7079, 0.292, 0.0001], [0.714, 0.2859, 0.0001],
      [0.719, 0.2809, 0.0001], [0.723, 0.277, 0], [0.726, 0.274, 0], [0.7283, 0.2717, 0], [0.73, 0.27, 0],
      [0.7311, 0.2689, 0], [0.732, 0.268, 0], [0.7327, 0.2673, 0], [0.7334, 0.2666, 0], [0.734, 0.266, 0],
      [0.7344, 0.2656, 0], [0.7346, 0.2654, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0],
      [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0],
      [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0],
      [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0], [0.7347, 0.2653, 0]]
};

var xyzToRgbMatrix = [
  [0.41847, -0.15866, -0.082835],
  [-0.091169, 0.25243, 0.015708],
  [0.00092090, -0.0025498, 0.17860]
];

function interpolate(t, from, to, fromValues, toValues){
  var alpha = (t - from) / (to - from);
  return fromValues.map((x,i) => x * alpha + toValues[i] * (1 - alpha));
}

function waveToXyz(l){
  if(l < xyzTable.start || l > xyzTable.start + xyzTable.step * (xyzTable.data.length - 1))
    return;
  if((l - xyzTable.start) % xyzTable.step === 0)
    return xyzTable.data[(l - xyzTable.start) / xyzTable.step].slice();
  else{
    var lower = Math.floor(l / xyzTable.step) * xyzTable.step;
    var upper = Math.ceil(l / xyzTable.step) * xyzTable.step;
    return interpolate(l, lower, upper, xyzTable.data[(lower - xyzTable.start) / xyzTable.step], xyzTable.data[(upper - xyzTable.start) / xyzTable.step]);
  }
}

function xyzToRgb(...values){
  return values.map((_, i, rgb) => xyzToRgbMatrix[i].reduce((r, a, j) => r + a * rgb[j], 0));
}

function waveToRgb(l){
  return xyzToRgb(...waveToXyz(l));
}

function makeDiscrete(...rgb){
  return rgb.map(x => Math.min(0xFF, Math.max(0, Math.round(0xFF * x))));
}


// 578 -> #bdff00 hue 76
// 630 -> #ff4f00 hue 19
// 636 -> #ff3400 hue 12
// 391 -> #7b0091 hue 291
// 428 -> #4600ff hue 256
// 523 -> #42ff00 hue 104
