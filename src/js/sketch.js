// SHAPES
const fibo = [987, 610, 377, 233, 144, 89, 55, 34, 21, 13, 8, 5, 3, 2]
const width = 1597
const height = 987

let polygonActions = 
  `<div class="col text-center d-grid">
    <button type="button" onclick="editShape()" class="btn btn-warning mt-4">Edit shape</button>
  </div>
  <div class="col text-center d-grid">
    <button type="button" onclick="removeShape()" class="btn btn-danger mt-4">Remove shape</button>
  </div>`

let ellipseActions =  
  `<div class="col text-center d-grid">
    <button type="button" onclick="editShape()" class="btn btn-warning mt-4">Edit shape</button>
  </div>
  <div class="col text-center d-grid">
    <button type="button" onclick="removeShape()" class="btn btn-danger mt-4">Remove shape</button>
  </div>`

let polygonValues = {
  sides: 4,
  size: 200,
  color: "#000000",
  alpha: 255,
  outline: 30,
  split: 4,
  pattern: "x"
}

let ellipseValues = {
  width: 200,
  height: 200,
  outline: 30,
  type: "smooth",
  color: "#000000",
  alpha: 255
}


let fiboBoxes = []
let shapeCoords = []
let shapes = []
let play = false
let shapeMode = "creating"
let currentShapeIndex = -1
let curShape = null

let form = null

function setup() {
  canvas = createCanvas(1597, 987)
  background("#333333")
  document.getElementById("mode-button").classList.toggle("disabled")

  showFibonacci()
  fillShapeCoords()

  Tone.Transport.bpm.value = 120
}

function draw() {
  background(255)
  showFibonacci()
  shapes.forEach((shape, i) => {
    push()

    if(shapeCoords[shape.fiboPos]) {
      translate(shapeCoords[shape.fiboPos][0], shapeCoords[shape.fiboPos][1])
    }

    if(shape instanceof Polygon && shape.sides % 2 !== 0) {     
      rotate(HALF_PI * 3)
    }

    shape.show()
    pop()
  })
}

function showFibonacci() {
  fiboBoxes = []
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

    let newBox 
    if(shapeMode === "editing" && fiboBoxes.length === currentShapeIndex) {
      newBox = new Box(x, y, num, "#F39C12", 5)
    } else {
      newBox = new Box(x, y, num)
    }
    
    fiboBoxes.push(newBox)
    newBox.show()
  }

  if(shapeMode === "editing") {
      fiboBoxes[currentShapeIndex].show()
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

    let sides = document.getElementById("polygon-sides").value
    let size = document.getElementById("polygon-size").value
    let c = document.getElementById("polygon-color").value
    let brightness = getBrightness(c)
    let pattern = document.getElementById("polygon-pattern").value
    let alpha = document.getElementById("polygon-alpha").value
    let outline = document.getElementById("polygon-outline").value
    let split = document.getElementById("polygon-split").value

    let newShape = new Polygon(0, 0, sides, size, c, alpha, brightness, pattern, outline, split, 0) 
    shapes.unshift(newShape)
    shiftShapes()

    shapes = shapes.slice(0, 14)

    toggleModeChange()
  })
}

function addEllipse(form) {
  form.submit(function(event) {
    event.preventDefault()
    let w = parseInt(document.getElementById("ellipse-width").value)
    let h = parseInt(document.getElementById("ellipse-height").value)
    let c = document.getElementById("ellipse-color").value
    let alpha = parseInt(document.getElementById("ellipse-alpha").value)
    let outline = parseInt(document.getElementById("ellipse-outline").value)
    let type = document.getElementById("ellipse-type").value

    let newShape = new Ellipse(0, 0, w, h, c, alpha, outline, type, 0)
    shapes.unshift(newShape)
    shiftShapes()

    shapes = shapes.slice(0, 14)

    toggleModeChange()
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
  shapes.forEach((shape) => {
    if(shapeCoords[shape.fiboPos + 1]) {
      shape.changeCoords(fibo[shape.fiboPos], fibo[shape.fiboPos + 1])
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

// WIP (Not used)
function printCurrentBox() {
  if (mouseX < fiboBoxes[0].s && mouseY < fiboBoxes[0].s) {
    console.log(true);
  }

  let curBox = fiboBoxes.find((box) => {
    return mouseX > box.x && mouseX < box.x + box.s && mouseY > box.y && mouseY < box.y + box.s
  })
}

function muteUnmute(icon) {
  icon.classList.toggle("bi-volume-mute-fill")
  icon.classList.toggle("bi-volume-up-fill")
  Tone.Master.mute = !Tone.Master.mute
}

function changeMode() {

  if(shapeMode === "creating" && shapesPresent()) {
    shapeMode = "editing"
    saveShapeValues()
    changeCurrentShape(1)

    document.querySelectorAll(".border-info").forEach(el => {
      el.classList.remove("border-info")
      el.classList.add("border-warning")
    })

    document.getElementById("heading").innerText = "Editing"
  } else if(shapeMode === "editing"){
    shapeMode = "creating"
    loadShapeValues()
    currentShapeIndex = -1
    curShape = null

    document.getElementById("next-shape").style.visibility = "hidden"
    document.getElementById("prev-shape").style.visibility = "hidden"

    document.getElementById("polygons-button").classList.remove("disabled")
    document.getElementById("ellipses-button").classList.remove("disabled")
    document.getElementById("polygons-button").disabled = false
    document.getElementById("ellipses-button").disabled = false

    document.querySelectorAll(".border-warning").forEach(el => {
      el.classList.remove("border-warning")
      el.classList.add("border-info")
    })

    document.getElementById("heading").innerText = "Creating"
  } else {
    return
  }

  setFormElements()


  document.getElementById("mode-button").classList.toggle("mode-icon-warning")
  document.getElementById("mode-button").classList.toggle("mode-icon-info")
  document.getElementById("mode-icon").classList.toggle("bi-plus-square")
  document.getElementById("mode-icon").classList.toggle("bi-pencil-square")
}

function changeCurrentShape(x = 0) {  
  curShape = x === 0 ? shapes[0] : shapes[shapes.indexOf(curShape) + x]
  currentShapeIndex = curShape.fiboPos

  setFormValues()

  let shapeIndex = shapes.indexOf(curShape)
  if(shapeIndex === shapes.length - 1 && shapes.length > 1) {
    document.getElementById("prev-shape").style.visibility = "visible"
    document.getElementById("next-shape").style.visibility = "hidden"   
  } else if (shapeIndex === 0 && shapes.length < 2) {
    document.getElementById("prev-shape").style.visibility = "hidden"
    document.getElementById("next-shape").style.visibility = "hidden"
  } else if (shapeIndex === 0 && shapes.length > 1) {
    document.getElementById("prev-shape").style.visibility = "hidden"
    document.getElementById("next-shape").style.visibility = "visible"
  } else {
    document.getElementById("prev-shape").style.visibility = "visible"
    document.getElementById("next-shape").style.visibility = "visible"
  }
}

function shapesPresent() {
  return shapes.length > 0
}

function toggleModeChange() {
  if(shapesPresent() && document.getElementById("mode-button").classList.contains("disabled")) {
    document.getElementById("mode-button").classList.add("mode-icon-warning")
    document.getElementById("mode-button").classList.toggle("disabled")
    document.getElementById("mode-button").classList.toggle("mode-icon")
  } else if (!shapesPresent()) {
    document.getElementById("mode-button").classList.remove("mode-icon-warning")
    document.getElementById("mode-button").classList.remove("mode-icon-info")
    document.getElementById("mode-button").classList.toggle("disabled")
    document.getElementById("mode-button").classList.toggle("mode-icon")
  }
}

function setFormElements() {
  let tempActions
  tempActions = document.getElementById("polygon-actions").innerHTML
  document.getElementById("polygon-actions").innerHTML = polygonActions
  polygonActions = tempActions

  tempActions = document.getElementById("ellipse-actions").innerHTML
  document.getElementById("ellipse-actions").innerHTML = ellipseActions
  ellipseActions = tempActions
}

function setFormValues() {
  if(curShape.constructor.name === "Polygon") {

    document.getElementById("settings-button").classList.add("collapsed")
    document.getElementById("polygons-button").classList.remove("collapsed")
    document.getElementById("ellipses-button").classList.add("collapsed")

    document.getElementById("polygons-button").classList.remove("disabled")
    document.getElementById("ellipses-button").classList.add("disabled")

    document.getElementById("polygons-button").disabled = false
    document.getElementById("ellipses-button").disabled = true

    document.getElementById("settings-container").classList.remove("show")
    document.getElementById("polygons-container").classList.add("show")
    document.getElementById("ellipses-container").classList.remove("show")
    
    document.getElementById("polygon-sides").value = curShape.sides
    document.getElementById("polygon-size").value = curShape.originalRadius
    document.getElementById("polygon-color").value = curShape.c
    let brightness = curShape.brightness
    document.getElementById("polygon-pattern").value = curShape.pattern
    document.getElementById("polygon-alpha").value = curShape.alpha
    document.getElementById("polygon-outline").value = curShape.originalOutline
    document.getElementById("polygon-split").value = curShape.split

  } else if (curShape.constructor.name === "Ellipse") {

    document.getElementById("settings-button").classList.add("collapsed")
    document.getElementById("polygons-button").classList.add("collapsed")
    document.getElementById("ellipses-button").classList.remove("collapsed")

    document.getElementById("polygons-button").classList.add("disabled")
    document.getElementById("ellipses-button").classList.remove("disabled")

    document.getElementById("polygons-button").disabled = true
    document.getElementById("ellipses-button").disabled = false
    
    document.getElementById("settings-container").classList.remove("show")
    document.getElementById("polygons-container").classList.remove("show")
    document.getElementById("ellipses-container").classList.add("show")

    document.getElementById("ellipse-width").value = curShape.originalW
    document.getElementById("ellipse-height").value = curShape.originalH
    document.getElementById("ellipse-color").value = curShape.c
    document.getElementById("ellipse-alpha").value = curShape.alpha
    document.getElementById("ellipse-outline").value = curShape.originalOutline
    document.getElementById("ellipse-type").value = curShape.type

  }
}

function saveShapeValues() {
  //POLYGON VALUES
  polygonValues.sides = document.getElementById("polygon-sides").value
  polygonValues.size = document.getElementById("polygon-size").value
  polygonValues.color = document.getElementById("polygon-color").value
  polygonValues.pattern = document.getElementById("polygon-pattern").value
  polygonValues.alpha= document.getElementById("polygon-alpha").value
  polygonValues.outline = document.getElementById("polygon-outline").value
  polygonValues.split = document.getElementById("polygon-split").value

  //ELLIPSE VALUES
  ellipseValues.width = document.getElementById("ellipse-width").value
  ellipseValues.height = document.getElementById("ellipse-height").value
  ellipseValues.outline = document.getElementById("ellipse-outline").value
  ellipseValues.type = document.getElementById("ellipse-type").value
  ellipseValues.color = document.getElementById("ellipse-color").value
  ellipseValues.alpha = document.getElementById("ellipse-alpha").value
}

function loadShapeValues() {
  //POLYGON VALUES
  document.getElementById("polygon-sides").value = polygonValues.sides
  document.getElementById("polygon-size").value = polygonValues.size 
  document.getElementById("polygon-color").value = polygonValues.color
  document.getElementById("polygon-pattern").value = polygonValues.pattern
  document.getElementById("polygon-alpha").value = polygonValues.alpha
  document.getElementById("polygon-outline").value = polygonValues.outline
  document.getElementById("polygon-split").value = polygonValues.split

  //ELLIPSE VALUES
  document.getElementById("ellipse-width").value = ellipseValues.width
  document.getElementById("ellipse-height").value = ellipseValues.height
  document.getElementById("ellipse-outline").value = ellipseValues.outline
  document.getElementById("ellipse-type").value = ellipseValues.type
  document.getElementById("ellipse-color").value = ellipseValues.color
  document.getElementById("ellipse-alpha").value = ellipseValues.alpha
}

function removeShape() {
  shapes.splice(shapes.indexOf(curShape), 1)
  curShape.remove()

  if(shapes.length < 1) {
    toggleModeChange()
    changeMode()
  } else {
    changeCurrentShape()
  }
} 

function editShape() {
  switch(curShape.constructor.name) {
    case "Polygon":
      let sides = document.getElementById("polygon-sides").value
      let size = document.getElementById("polygon-size").value
      let cP = document.getElementById("polygon-color").value
      let brightness = getBrightness(cP)
      let pattern = document.getElementById("polygon-pattern").value
      let alphaP = document.getElementById("polygon-alpha").value
      let outlineP = document.getElementById("polygon-outline").value
      let split = document.getElementById("polygon-split").value

      curShape.edit(sides, size, cP, brightness, pattern, alphaP, outlineP, split)
      break;
    case "Ellipse":
      let w = parseInt(document.getElementById("ellipse-width").value)
      let h = parseInt(document.getElementById("ellipse-height").value)
      let cE = document.getElementById("ellipse-color").value
      let alphaE = parseInt(document.getElementById("ellipse-alpha").value)
      let outlineE = parseInt(document.getElementById("ellipse-outline").value)
      let type = document.getElementById("ellipse-type").value

      curShape.edit(w, h, cE, alphaE, outlineE, type)
      break;
    default:
      break;
  }  
}