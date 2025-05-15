import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  EventEmitter, HostListener,
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
import {FormsModule} from '@angular/forms';
import {SceneInputComponent} from '../scene-input/scene-input.component';
import loadImage from '../../utils/loadImage';

@Component({
  selector: 'blearn-scene',
  imports: [
    ButtonComponent,
    NgClass,
    FormsModule,
    SceneInputComponent
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
  @Input() bgSrc: string | undefined = undefined;

  @Output() runCode = new EventEmitter<void>();
  @Output() sceneObjectsChange = new EventEmitter<void>();
  @Output() objectAdded = new EventEmitter<void>();
  @Output() objectSelected = new EventEmitter<string>();
  @Output() objectDeleted = new EventEmitter<string>();
  @Output() objectDuplicated = new EventEmitter<string>();
  @Output() backgroundChange = new EventEmitter<void>();

  private ctx: CanvasRenderingContext2D | null = null;
  private draggingObject: SceneObject | null = null;
  private offsetX: number = 0;
  private offsetY: number = 0;
  public bgImage: HTMLImageElement | null = null;

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
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          obj.img = img;
          resolve();
        }
      });
    });
    imageLoadPromises.push(new Promise<void>((resolve) => {
      const bg = new Image();
      bg.src = '/backgrounds/forest.jpg';
      bg.onload = () => {
        this.bgImage = bg;
        resolve();
      }
    }));

    Promise.all(imageLoadPromises).then(() => {
      if (this.sceneObjects.length > 0) this.objectSelected.emit(this.sceneObjects[0].id);
      this.drawImages()
    });
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
        if (mouseX >= sceneObj.x && mouseX <= sceneObj.x + sceneObj.size && mouseY >= sceneObj.y && mouseY <= sceneObj.y + sceneObj.size) {
          this.draggingObject = sceneObj;
          this.offsetX = mouseX - sceneObj.x;
          this.offsetY = mouseY - sceneObj.y;
          this.objectSelected.emit(sceneObj.id);
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

    if (this.bgImage) {
      this.ctx.drawImage(this.bgImage!, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    } else {
      this.ctx.fillStyle = '#d1d5db';
      this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }

    for (let obj of this.sceneObjects) {
      this.ctx.save();

      const angleInRadians = obj.rotation * Math.PI / 180;

      const centerX = obj.x + obj.size / 2;
      const centerY = obj.y + obj.size / 2;

      this.ctx.translate(centerX, centerY);
      this.ctx.rotate(angleInRadians);

      if (obj.id === this.selectedObjectId()) {
        this.ctx.shadowColor = 'red';
        this.ctx.shadowBlur = 20;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
      }

      if (obj.img) this.ctx.drawImage(obj.img!, -obj.size / 2, -obj.size / 2, obj.size, obj.size);

      this.ctx.restore();
    }
  }
}
