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
import {ButtonComponent} from '../../layout/button/button.component';
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
  @Input() selectedObjectId = signal<string | undefined>(undefined);

  @Output() runCode = new EventEmitter<void>();
  @Output() sceneObjectsChange = new EventEmitter<void>();
  @Output() objectAdded = new EventEmitter<void>();
  @Output() objectSelected = new EventEmitter<string>();
  @Output() objectDeleted = new EventEmitter<string>();
  @Output() objectDuplicated = new EventEmitter<SceneObject>();

  private ctx: CanvasRenderingContext2D | null = null;
  private draggingObject: SceneObject | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  protected contextMenuVisible = false;
  protected contextMenuX = 0;
  protected contextMenuY = 0;
  protected contextMenuObject: SceneObject | null = null;

  protected selectedObject= computed(() => {
    if (!this.selectedObjectId()) return undefined;

    return this.sceneObjects.find(obj => obj.id === this.selectedObjectId());
  });

  ngAfterViewInit(): void {
    this.initCanvas();
  }

  private initCanvas() {
    const canvasEl = this.canvas.nativeElement;
    const style = getComputedStyle(canvasEl);

    const width = parseFloat(style.width);
    const height = parseFloat(style.height);

    canvasEl.width = width;
    canvasEl.height = height;

    this.ctx = canvasEl.getContext('2d');

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

  protected onRightClick(event: MouseEvent, obj: SceneObject) {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuObject = obj;
  }

  @HostListener('document:click')
  hideContextMenu() {
    this.contextMenuVisible = false;
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

      if (!obj.img) {
        const img = new Image();
        img.src = obj.imgSrc;
        img.onload = () => {
          obj.img = img;
          this.ctx?.drawImage(obj.img!, obj.x, obj.y, obj.width, obj.height);
        }
      } else
        this.ctx.drawImage(obj.img!, obj.x, obj.y, obj.width, obj.height);

      this.ctx.restore();
    }
  }
}
