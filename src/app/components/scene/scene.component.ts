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
import {NgClass} from '@angular/common';

@Component({
  selector: 'blearn-scene',
  imports: [
    ButtonComponent,
    NgClass
  ],
  templateUrl: './scene.component.html',
})
export class SceneComponent implements AfterViewInit {
  protected modeService = inject(ModeService);

  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('scene') scene!: ElementRef;

  @Input() isRunning = signal<boolean>(false);
  @Input() sceneObjects: SceneObject[] = [];
  @Input() selectedObject = signal<string | undefined>(undefined);

  @Output() runCode = new EventEmitter<void>();
  @Output() sceneObjectsChange = new EventEmitter<void>();
  @Output() objectAdded = new EventEmitter<void>();
  @Output() objectSelected = new EventEmitter<string>();

  private ctx: CanvasRenderingContext2D | null = null;
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

    const imageLoadPromises = this.sceneObjects.map(obj => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = obj.imgSrc;
        img.onload = () => {
          obj.img = img;
          resolve();
        }
      });
    });

    Promise.all(imageLoadPromises).then(() => this.drawImages());
    this.setupMouseEvents();
  }

  protected addObject() {
    this.objectAdded.emit();
  }

  private setupMouseEvents() {
    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      if (this.isRunning()) return;

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
      if (this.isRunning()) return;

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
      if (this.isRunning()) return;

      if (this.draggingObject !== null) this.sceneObjectsChange.emit();
      this.draggingObject = null;
    });

    this.canvas.nativeElement.addEventListener('mouseleave', () => {
      if (this.isRunning()) return;

      this.draggingObject = null;
    });
  }

  public drawImages() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    for (let obj of this.sceneObjects) {
      this.ctx.save();

      if (obj.id === this.selectedObject()) {
        this.ctx.shadowColor = 'red';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
      }
      this.ctx.drawImage(obj.img!, obj.x, obj.y, obj.width, obj.height);

      this.ctx.restore();
    }
  }
}
