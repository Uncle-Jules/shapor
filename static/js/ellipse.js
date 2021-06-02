class Ellipse {
  constructor(x, y, w, h, c, outline, type) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.c = c
    this.type = type
    this.outline = outline
    this.originalOutline = outline
    this.oscNum = reverseNumber(Math.floor(tranposeNumber(w, 10, 450, 1, 32)), 1, 32)
    this.osc = 
      type === "smooth" ? new Tone.Oscillator(h, `sine${this.oscNum}`).toDestination().start() :
      type === "spiky" ? new Tone.Oscillator(h, `triangle${this.oscNum}`).toDestination().start() :
      type === "toothy" ? new Tone.Oscillator(h, `sawtooth${this.oscNum}`).toDestination().start() :
      type === "choppy" ? new Tone.Oscillator(h, `square${this.oscNum}`).toDestination().start() : new Tone.Oscillator(h, "sine").toDestination().start()
    this.osc.volume.value = tranposeNumber(outline, 0, 60, -40, 10)

    this.fiboPos = 0
    this.decoVal = 10

    this.show = function() {
      push()
      fill(this.c)     
      let angle = TWO_PI / 100
      beginShape()

      let skip = true
      for (let a = 0; a < TWO_PI; a += angle) {
        let sx = this.x + cos(a) * this.w
        let sy = this.y + sin(a) * this.h

        switch(this.type) {
          case "smooth":
            break; 
          case "spiky":
            switch(skip) {
              case true:
                let x2 = this.x + cos(a + angle / 2) * (this.w + this.decoVal)
                let y2 = this.y + sin(a + angle / 2) * (this.h + this.decoVal)

                let x3 = this.x + cos(a + angle) * this.w
                let y3 = this.y + sin(a + angle) * this.h
                triangle(sx, sy, x2, y2, x3, y3)
                break;
              default:
                break;
            }
            break;
          case "toothy":
            switch(skip) {
              case true:
                let x2 = this.x + cos(a + angle / 2) * (this.w + this.decoVal)
                let y2 = this.y + sin(a + angle / 2) * (this.h + this.decoVal)

                let x3 = this.x + cos(a + angle / 2) * this.w
                let y3 = this.y + sin(a + angle / 2) * this.h
                triangle(sx, sy, x2, y2, x3, y3)
                break;
              default:
                break;
            }
          case "choppy":
            switch(skip) {
              case true:
                rectMode(CENTER, CENTER)
              rect(sx, sy, this.decoVal, this.decoVal)
                break;
              default:
                break;
            } 
            break;
          default:
            break;
        }
        skip = !skip

        stroke("black")
        strokeWeight(this.outline)
        vertex(sx, sy)
      }
      endShape(CLOSE)
      
      this.firstTime = false
      pop()
    }

    this.changeCoords = function(x, y, r1, r2) {
      if (r1 && r2) {
        this.w = this.w * (r2 / r1)
        this.h = this.h * (r2 / r1)
        this.outline = this.outline * (r2 / r1)
        this.decoVal = this.decoVal * (r2 / r1)
      }

      this.x = x
      this.y = y
      this.fiboPos++
      if(this.fiboPos === 14) {
        this.osc.dispose()
      }
    }
  }
}