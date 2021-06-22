class Box {
  constructor(x, y, s, c = "black", sw = 1) {
    this.x = x
    this.y = y
    this.s = s
    this.c = c
    this.sw = sw

    this.show = function() {
      push()
      rectMode(CORNER)
      strokeWeight(this.sw)
      stroke(this.c)
      rect(this.x, this.y, this.s, this.s)
      pop()
    }
  }
}