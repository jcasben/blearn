export class SceneObject {
  constructor(
    public id: string,
    public imgSrc: string,
    public x: number,
    public y: number,
    public rotation: number,
    public size: number,
    public workspace: string,
    public lookingLeft: boolean = true,
    public img?: HTMLImageElement,
  ) {}

  moveForward(steps: number) {
    const radians = (this.rotation * Math.PI) / 180;

    if (this.lookingLeft) {
      this.x -= Math.cos(radians) * steps;
      this.y -= Math.sin(radians) * steps;
    } else {
      this.x += Math.cos(radians) * steps;
      this.y += Math.sin(radians) * steps;
    }
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setDirection(direction: 'left' | 'right') {
    this.lookingLeft = direction === 'left';
  }

  turnLeft(angle: number) {
    this.rotation = (this.rotation - angle) % 360;
  }

  turnRight(angle: number) {
    this.rotation = (this.rotation + angle) % 360;
  }
}
