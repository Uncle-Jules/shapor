class Ellipse {
  constructor(x, y, w, h, c) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.c = c

    this.show = function() {
      push()
      fill(this.c)
      ellipse(this.x, this.y, this.h, this.w)
      pop()
    }
  }
}