import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {SceneObject} from '../../models/scene-object';
import {ButtonComponent} from '../button/button.component';
import {ModeService} from '../../services/mode.service';

@Component({
  selector: 'blearn-scene',
  imports: [
    ButtonComponent
  ],
  templateUrl: './scene.component.html',
})
export class SceneComponent implements AfterViewInit {
  protected modeService = inject(ModeService);

  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('scene') scene!: ElementRef;

  @Input() isRunning = signal<boolean>(false);
  @Output() runCode = new EventEmitter<void>();
  @Output() stopCode = new EventEmitter<void>();

  private ctx: CanvasRenderingContext2D | null = null;
  protected sceneObjects: Array<SceneObject> = [];
  private draggingObject: SceneObject | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  private initCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d');

    // Initialize the canvas size based on the scene
    this.canvas.nativeElement.width = this.scene.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.scene.nativeElement.offsetHeight;

    // Create an image object
    const img = new Image();
    img.src = 'https://avatars.githubusercontent.com/u/105555875?v=4';  // Replace with your image URL
    img.onload = () => {
      // Once the image is loaded, draw it to the canvas
      this.sceneObjects.push({img, x: 50, y: 50, rotation: 0, width: 100, height: 100});
      this.drawImages();
    };

    // Set up mouse event listeners for dragging
    this.setupMouseEvents();
  }

  protected addObject() {
    const img = new Image();
    img.src = 'https://avatars.githubusercontent.com/u/105555875?v=4';  // Replace with your image URL
    img.onload = () => {
      // Once the image is loaded, draw it to the canvas
      this.sceneObjects.push({img, x: 50, y: 50, rotation: 0, width: 100, height: 100});
      this.drawImages();
    };
  }

  private setupMouseEvents() {
    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;

      // Check if the mouse click is on one of the images
      for (let sceneObj of this.sceneObjects) {
        if (mouseX >= sceneObj.x && mouseX <= sceneObj.x + sceneObj.width && mouseY >= sceneObj.y && mouseY <= sceneObj.y + sceneObj.height) {
          this.draggingObject = sceneObj;
          this.offsetX = mouseX - sceneObj.x;
          this.offsetY = mouseY - sceneObj.y;
        }
      }
    });

    this.canvas.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.draggingObject) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Move the image based on mouse position
        this.draggingObject.x = mouseX - this.offsetX;
        this.draggingObject.y = mouseY - this.offsetY;

        this.drawImages();
      }
    });

    this.canvas.nativeElement.addEventListener('mouseup', () => {
      this.draggingObject = null;
    });

    this.canvas.nativeElement.addEventListener('mouseleave', () => {
      this.draggingObject = null;
    });
  }

  private drawImages() {
    if (!this.ctx) return;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Draw each image on the canvas
    for (let imgObj of this.sceneObjects) {
      this.ctx.drawImage(imgObj.img, imgObj.x, imgObj.y, imgObj.width, imgObj.height);
    }
  }

  moveTo(x: number, y: number) {
    if (this.sceneObjects.length > 0) {
      const obj = this.sceneObjects[0];
      obj.x = x;
      obj.y = y;
      this.drawImages();
    }
  }

  moveForward(steps: number) {
    const obj = this.sceneObjects[0];
    obj.x += steps;
    this.drawImages();
  }

  setDirection(angle: number) {

  }

  turnLeft(angle: number) {

  }

  turnRight(angle: number) {

  }
}
