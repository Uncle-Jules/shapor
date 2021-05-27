// SHAPES
const fibo = [987, 610, 377, 233, 144, 89, 55, 34, 21, 13, 8, 5, 3, 2]
const width = 1597
const height = 987
let fiboBoxes = []
let shapeCoords = []
let shapes = []
let play = false

function setup() {
  canvas = createCanvas(1597, 987)
  background("#333333")
  showFibonacci()
  fillShapeCoords()
}

function draw() {
  background(255)
  showFibonacci()
  shapes.forEach((shape) => {
    shape.show()
  })
}

function showFibonacci() {
  rectMode(CORNER)

  let fIndex = 0
  let direction = 1
  let x = 0
  let y = 0
  for(num of fibo) {
    switch (direction) {
      case 1:
        if (num === fibo[0]) {         
        } else {
          x += fibo[fIndex]
        }
        direction = 2
        break;
      case 2:
        x += fibo[fIndex]
        direction = 3
        break;
      case 3:
        fIndex += 3
        x += fibo[fIndex] 
        fIndex -= 2
        y += fibo[fIndex]
        direction = 4
        break;
      case 4:
        fIndex += 2
        x -= fibo[fIndex]
        fIndex += 1
        y += fibo[fIndex]
        direction = 5
        break;
      case 5:
        y -= fibo[fIndex]
        direction = 2
        break;
      default:
        break;
    }
    let newBox = new Box(x, y, num)
    fiboBoxes.push(newBox)
    newBox.show()
  }
}

function fillShapeCoords() {
  fiboBoxes.forEach((box, i) => {
    shapeCoords.push([box.x + fibo[i] / 2, box.y + fibo[i] / 2])
  })
}

function addShape() {
  let sides = document.getElementById("sides").value
  let size = document.getElementById("size").value
  let color = document.getElementById("color").value
  let brightness = getBrightness(color)

  let newShape = new Polygon(0, 0, sides, size, color, brightness) 
  shapes.unshift(newShape)
  shiftShapes()

  shapeToSound()

  shapes = shapes.slice(0,14)

  
}

function shapeToSound() {

}

function shiftShapes() {
  shapes.forEach((shape, i) => {
    if(shapeCoords[i]) {
      shape.changeCoords(shapeCoords[i][0], shapeCoords[i][1], fibo[i - 1], fibo[i])
    }
  })
}

function getBrightness(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return Math.max(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16))
}

function mouseClicked() {
  if(!play) {
    Tone.start()
    Tone.Transport.start()
    play = true
  }
}