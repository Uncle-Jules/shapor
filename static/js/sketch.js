// SHAPES
const fibo = [987, 610, 377, 233, 144, 89, 55, 34, 21, 13, 8, 5, 3, 2]
const width = 1597
const height = 987
let fiboBoxes = []
let shapeCoords = []
let shapes = []
let play = false

let form = null

function setup() {
  canvas = createCanvas(1597, 987)
  background("#333333")
  showFibonacci()
  fillShapeCoords()

  Tone.Transport.bpm.value = 120
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

function addPolygon(form) {
  form.submit(function(event) {
    event.preventDefault()
    let sides = document.getElementById("sides").value
    let size = document.getElementById("size").value
    let c = document.getElementById("color").value
    let brightness = getBrightness(c)
    let pattern = document.getElementById("pattern").value
    let alpha = document.getElementById("alpha").value
    let outline = document.getElementById("outline").value
    let split = document.getElementById("split").value

    let newShape = new Polygon(0, 0, sides, size, c, alpha, brightness, pattern, outline, split) 
    shapes.unshift(newShape)
    shiftShapes()

    shapes = shapes.slice(0, 14)
  })
}

function addEllipse(form) {
  form.submit(function(event) {
    event.preventDefault()
    let w = parseInt(document.getElementById("ellipse-width").value)
    let h = parseInt(document.getElementById("ellipse-height").value)
    let c = document.getElementById("ellipse-color").value
    let outline = parseInt(document.getElementById("ellipse-outline").value)
    let type = document.getElementById("ellipse-type").value

    let newShape = new Ellipse(0, 0, w, h, c, outline, type)

    shapes.unshift(newShape)
    shiftShapes()

    shapes = shapes.slice(0, 14)
  })
}

function updateSettings(form) {
  form.submit(function(event) {
    event.preventDefault()
    Tone.Transport.bpm.value = document.getElementById("bpm").value
    Tone.Master.volume.value = document.getElementById("volume").value
  })
}

function shiftShapes() {
  shapes.forEach((shape, i) => {
    if(shapeCoords[i]) {
      shape.changeCoords(shapeCoords[i][0], shapeCoords[i][1], fibo[i - 1], fibo[i])
    }
  })
}

function mouseClicked() {
  if(!play) {
    Tone.start()
    Tone.Transport.start()
    play = true
  }
}

// Event listeners

