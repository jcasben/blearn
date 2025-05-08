export class SceneObject {
  constructor(
    public id: string,
    public imgSrc: string,
    public x: number,
    public y: number,
    public rotation: number,
    public width: number,
    public height: number,
    public workspace: string,
    public img?: HTMLImageElement,
  ) {}

  moveForward(steps: number) {
    this.x += steps;
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setDirection(angle: number) {

  }

  turnLeft(angle: number) {

  }

  turnRight(angle: number) {

  }
}
