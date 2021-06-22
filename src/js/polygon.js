class Polygon {
  constructor(x, y, sides, radius, c, alpha, brightness, pattern, outline, split) {
    this.x = x
    this.y = y
    this.sides = sides
    this.originalRadius = radius
    this.radius = radius
    this.c = c
    this.alpha = alpha
    this.rgb = getRGB(c)
    this.brightness = brightness
    this.pattern = pattern
    this.patternGen = generate(pattern)
    this.originalOutline = outline
    this.outline = outline
    this.split = split
    this.synth = sides === "3" ? new Tone.AMSynth().toDestination() : 
      sides === "4" ? new Tone.Synth().toDestination() :
      sides === "5" ? new Tone.MetalSynth().toDestination() : 
      sides === "6" ? new Tone.FMSynth().toDestination() :
      sides === "7" ? new Tone.MembraneSynth().toDestination() :
      sides === "8" ? new Tone.MonoSynth().toDestination() :
      sides === "9" ? new Tone.PolySynth().toDestination() : new Tone.Synth().toDestination()
      

    if(this.rgb[0] > 0) {
      this.vibrato = new Tone.Vibrato(tranposeNumber(this.rgb[0], 0, 255, 1, 10), 0.75).toDestination()
      this.synth.connect(this.vibrato)
    }

    if(this.rgb[1] > 0) {
      this.tremolo = new Tone.Tremolo(tranposeNumber(this.rgb[0], 0, 255, 1, 10), 0.75).toDestination()
      this.synth.connect(this.tremolo)
    }

    if(this.rgb[2] > 0) {
      this.reverb = new Tone.Reverb(tranposeNumber(this.rgb[0], 0, 255, 1, 10), 0.75).toDestination()
      this.synth.connect(this.reverb)
    }

    if(this.alpha < 255) {
      this.filter = new Tone.Filter(tranposeNumber(reverseNumber(this.alpha, 0, 255), 0, 255, 0, 5000), "lowpass").toDestination()
      this.synth.connect(this.filter)
    }
    
    this.fiboPos = -1
    this.fontSize = 30

    this.loop = new Tone.Loop((time) => {

      let beat = this.patternGen.next().value

      if (beat === "x") {
        this.synth.triggerAttackRelease(reverseNumber(this.originalRadius, 10, 450) * 2, `${this.split}n`, time, linToLog(this.originalOutline, 0, 60, 0.1, 2))
      }    
    }, `${this.split}n`)
    this.loop.start(0);

    this.show = function() {
      push()

      let realColor = color(this.c)
      realColor.setAlpha(this.alpha)
      fill(realColor)

      let angle = TWO_PI / this.sides
      beginShape()
      for (let a = 0; a < TWO_PI; a += angle) {

        let sx = this.x + cos(a) * this.radius
        let sy = this.y + sin(a) * this.radius

        stroke("black")
        strokeWeight(this.outline)
        vertex(sx, sy);
      }
      endShape(CLOSE)

      stroke(invertHex(this.c))
      strokeWeight(2)
      let pointAngle = TWO_PI / this.split
      for(let angle = 0; angle < TWO_PI; angle+=pointAngle) {
        let newX = this.x + cos(angle) * this.radius
        let newY = this.y + sin(angle) * this.radius
        line(this.x, this.y, newX, newY)
      }
     
      if(this.sides % 2 !== 0) {
        rotate(HALF_PI)
      }
      
      textAlign(CENTER, CENTER)
      textFont("Georgia")
      textSize(this.fontSize)
      fill("black")
      text(this.pattern, this.x, this.y)

      if(this.sides % 2 !== 0) {
        rotate(HALF_PI)
      }

      pop()
    }

    this.changeCoords = function(r1, r2) {
      push()
      if(r1 && r2) {
        this.radius = this.radius * (r2 / r1)
        this.outline = this.outline * (r2 / r1)
        this.fontSize = this.fontSize * (r2 / r1)
      }

      this.fiboPos++
      if(this.fiboPos === 13) {
        this.remove()
      }
      pop()
    }

    this.remove = function() {
      this.synth.dispose()
      this.loop.dispose()
    }

    this.edit = function(sides, size, c, brightness, pattern, alpha, outline, split) {
      this.sides = sides
      this.radius = size * (this.radius / this.originalRadius)
      this.originalRadius = size
      this.c = c
      this.alpha = alpha
      this.rgb = getRGB(c)
      this.brightness = brightness
      this.pattern = pattern
      this.patternGen = generate(pattern)
      this.outline = outline * (this.outline / this.originalOutline)
      this.originalOutline = outline
      this.split = split

      this.synth.dispose()
      this.loop.dispose()
      this.synth = sides === "3" ? new Tone.AMSynth().toDestination() : 
        sides === "4" ? new Tone.Synth().toDestination() :
        sides === "5" ? new Tone.MetalSynth().toDestination() : 
        sides === "6" ? new Tone.FMSynth().toDestination() :
        sides === "7" ? new Tone.MembraneSynth().toDestination() :
        sides === "8" ? new Tone.MonoSynth().toDestination() :
        sides === "9" ? new Tone.PolySynth().toDestination() : new Tone.Synth().toDestination()

      if(this.rgb[0] > 0) {       
        this.vibrato = new Tone.Vibrato(tranposeNumber(this.rgb[0], 0, 255, 1, 10), 0.75).toDestination()
        this.synth.connect(this.vibrato)
      }

      if(this.rgb[1] > 0) {
        this.tremolo = new Tone.Tremolo(tranposeNumber(this.rgb[0], 0, 255, 1, 10), 0.75).toDestination()
        this.synth.connect(this.tremolo)
      }
  
      if(this.rgb[2] > 0) {
        this.reverb = new Tone.Reverb(tranposeNumber(this.rgb[0], 0, 255, 1, 10), 0.75).toDestination()
        this.synth.connect(this.reverb)
      }
  
      if(this.alpha < 255) {
        this.filter = new Tone.Filter(tranposeNumber(reverseNumber(this.alpha, 0, 255), 0, 255, 0, 5000), "lowpass").toDestination()
        this.synth.connect(this.filter)
      }
          
      this.loop = new Tone.Loop((time) => {

        let beat = this.patternGen.next().value
  
        if (beat === "x") {
          this.synth.triggerAttackRelease(reverseNumber(this.originalRadius, 10, 450) * 2, `${this.split}n`, time, linToLog(this.originalOutline, 0, 60, 0.1, 2))
        }    
      }, `${this.split}n`)
      this.loop.start(0);
    }
  }
}