class Polygon {
  constructor(x, y, sides, radius, color, brightness) {
    this.x = x
    this.y = y
    this.sides = sides
    this.originalRadius = radius
    this.radius = radius
    this.color = color
    this.rgb = getRGB(color)
    this.brightness = brightness
    this.fiboPos = 0
    this.synth = 
      this.rgb[0] > this.rgb[1] > this.rgb[2] ? new Tone.Synth().toDestination() : 
      this.rgb[0] < this.rgb[1] < this.rgb[2] ? new Tone.PluckSynth().toDestination() :
      this.rgb[0] < this.rgb[1] > this.rgb[2] ? new Tone.MetalSynth().toDestination() : new Tone.Synth().toDestination();

    this.loop = new Tone.Loop((time) => {
      this.synth.triggerAttackRelease(this.brightness * 2, `${this.sides}n`, time, this.originalRadius / 1000)
    }, `${this.sides}n`)
    this.loop.start(0);

    this.show = function() {
      push()
      fill(this.color)
      noStroke()
      let angle = TWO_PI / sides
      beginShape()
      for (let a = 0; a < TWO_PI; a += angle) {
        let sx = this.x + cos(a) * this.radius
        let sy = this.y + sin(a) * this.radius
        vertex(sx, sy);
      }
      endShape(CLOSE)
      pop()
    }

    this.changeCoords = function(x, y, r1, r2) {
      if(r1 && r2) {
        this.radius = this.radius * (r2 / r1)
      }

      this.x = x
      this.y = y
      this.fiboPos++
      if(this.fiboPos === 14) {
        this.synth.dispose()
        this.loop.dispose()
      }
    }
  }
}