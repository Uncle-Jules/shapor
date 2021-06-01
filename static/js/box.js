class Box {
  constructor(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;

    this.show = function() {
      push();
      rectMode(CORNER)
      rect(this.x, this.y, this.s, this.s);
      pop();
    }
  }
}