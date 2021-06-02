function getRGB(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

function* generate(array) {
  let i = 0
  while(true) {
    let value = array[i % array.length]
    i++
    yield value
  }
}

function reverseNumber(num, min, max) {
  return (max + min) - num
}

function getBrightness(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return Math.max(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16))
}

function linToLog(position, minp, maxp, minLog, maxLog) {

  // The result should be between 0 an 100
  var minv = Math.log(minLog);
  var maxv = Math.log(maxLog);

  // calculate adjustment factor
  var scale = (maxv-minv) / (maxp-minp);
  return Math.exp(minv + scale*(position-minp));
}

function tranposeNumber(position, minp, maxp, minv, maxv) {
  let percentage = position / (minp + maxp)

  let newValue;
  if(minv < 0 || maxv < 0) {
    newValue = ((minv + minv * -1 + maxv + minv * -1) * percentage) + minv
  } else {
    newValue = (minv + maxv) * percentage
  }
  return newValue
}