import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  signal,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivityService} from '../../services/activity.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {BlocklyEditorComponent} from '../../components/blockly-editor/blockly-editor.component';
import {Activity} from '../../models/activity';
import {FormsModule} from '@angular/forms';
import {ModeService} from '../../services/mode.service';
import {TitleComponent} from '../../components/title/title.component';
import {ButtonComponent} from '../../components/button/button.component';
import * as Blockly from 'blockly';
import {BlocksModalComponent} from '../../components/blocks-modal/blocks-modal.component';

@Component({
  selector: 'blearn-activity-detail',
  imports: [
    BlocklyEditorComponent,
    FormsModule,
    TitleComponent,
    ButtonComponent,
  ],
  templateUrl: './activity-detail.component.html',
})
export class ActivityDetailComponent implements AfterViewInit {
  private route = inject(ActivatedRoute);
  protected activityService = inject(ActivityService);
  protected modeService = inject(ModeService);
  private router = inject(Router);

  //@ViewChild(BlocklyEditorComponent) blocklyEditorComponent!: BlocklyEditorComponent;
  @ViewChild('blocklyDiv') blocklyDiv!: ElementRef;
  @ViewChild('blocklyArea') blocklyArea!: ElementRef;
  @ViewChild('modalHost', {read: ViewContainerRef}) modalHost!: ViewContainerRef;
  @ViewChild('scene') scene!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  private ctx: CanvasRenderingContext2D | null = null;
  private images: Array<{ img: HTMLImageElement, x: number, y: number, width: number, height: number }> = [];
  private draggingImage: any = null;
  private offsetX: number = 0;
  private offsetY: number = 0;

  private workspace!: Blockly.WorkspaceSvg;
  protected toolbox = signal({
    kind: 'flyoutToolbox',
    contents: [
      {kind: '', text: '', callbackKey: ''},
      {kind: '', type: ''},
    ]
  });

  private readonly BLOCK_LIMITS: Map<string, number>;

  protected activity = signal<Activity | null>(null);

  constructor() {
    const computedActivity = computed(() => {
      const id = this.activityId();
      if (!id) {
        this.router.navigate(['/']).then();
        return null;
      }

      const activity = this.activityService.getActivity(id);
      if (!activity) {
        this.router.navigate(['/']).then();
        return null;
      }

      return activity;
    });

    this.activity.set(computedActivity());
    console.log(this.activity()!.toolboxInfo.BLOCK_LIMITS)
    this.BLOCK_LIMITS = new Map<string, number>(Object.entries(this.activity()!.toolboxInfo.BLOCK_LIMITS));
    console.log(this.BLOCK_LIMITS);
  }

  private updateToolboxLimits(workspace: Blockly.WorkspaceSvg) {
    const blockCounts = new Map<string, number>();
    workspace.getAllBlocks(false).forEach(block => {
      const type = block.type;
      blockCounts.set(type, (blockCounts.get(type) || 0) + 1);
    });

    const newToolbox = {
      kind: 'flyoutToolbox',
      contents: this.toolbox().contents.map((entry: any) => {
        if (entry.kind === 'block') {
          const currentCount = blockCounts.get(entry.type) || 0;
          const limit = this.BLOCK_LIMITS.get(entry.type);
          return {
            ...entry,
            enabled: limit !== undefined ? currentCount < limit : true,
          };
        } else return entry;
      })
    }

    workspace.updateToolbox(newToolbox);
  }

  ngAfterViewInit(): void {
    this.initBlockly();
    this.initCanvas();
  }

  private openBlocksModal() {
    const modalRef = this.modalHost.createComponent(BlocksModalComponent);
    modalRef.instance.BLOCKS_LIMIT = this.BLOCK_LIMITS;

    modalRef.instance.blockAdded.subscribe(type => {
      if (this.BLOCK_LIMITS.has(type)) this.BLOCK_LIMITS.set(type, this.BLOCK_LIMITS.get(type)! + 1)
      else this.BLOCK_LIMITS.set(type, 1);

      if (!this.toolbox().contents.some(block => block.type === type)) {
        const newToolbox = {
          ...this.toolbox(),
          contents: [...this.toolbox().contents, {kind: 'block', type}],
        };
        this.toolbox.set(newToolbox);
      }

      this.updateToolboxLimits(this.workspace);
    });

    modalRef.instance.blockRemoved.subscribe(type => {
      if (this.BLOCK_LIMITS.get(type) === 1) {
        this.BLOCK_LIMITS.delete(type);

        if (this.toolbox().contents.some(block => block.type === type)) {
          const newToolbox = {
            ...this.toolbox(),
            contents: this.toolbox().contents.filter(block => block.type !== type)
          }
          this.toolbox.set(newToolbox);
        }
      } else if (this.BLOCK_LIMITS.has(type) && this.BLOCK_LIMITS.get(type)! > 1) this.BLOCK_LIMITS.set(type, this.BLOCK_LIMITS.get(type)! - 1);

      this.updateToolboxLimits(this.workspace);
    });
    modalRef.instance.close.subscribe(() => modalRef.destroy());
  }

  private activityId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') || null)
    )
  );

  updateTitle(newTitle: string) {
    if (this.activity()) {
      this.activity.set({...this.activity()!, title: newTitle});
      this.activityService.updateActivity(this.activityId()!, this.activity()!);
    }
  }

  saveWorkspace() {
    const jsonWorkspace = Blockly.serialization.workspaces.save(this.workspace);
    if (this.modeService.getMode() === 'teacher') this.toolbox().contents.shift();
    const jsonToolbox = JSON.stringify(this.toolbox());
    const workspaceJSON = JSON.stringify(jsonWorkspace);
    this.activity.set({
      ...this.activity()!,
      workspace: workspaceJSON,
      toolboxInfo: {BLOCK_LIMITS: Object.fromEntries(this.BLOCK_LIMITS), toolboxDefinition: jsonToolbox}
    });
    console.log(this.activity()!);
    this.activityService.updateActivity(this.activityId()!, this.activity()!);
    //const workspaceJSON = this.blocklyEditorComponent.saveWorkspaceAsJson();
    //this.activity.set({ ...this.activity()!, workspace: workspaceJSON });
    //this.activityService.updateActivity(this.activityId()!, this.activity()!);
  }

  private initBlockly() {
    this.toolbox.set(JSON.parse(this.activity()!.toolboxInfo.toolboxDefinition));

    if (this.modeService.getMode() === 'teacher') {
      const newToolbox = {
        ...this.toolbox(),
        contents: [
          {
            kind: 'button',
            text: '+ Add Blocks to this toolbox',
            callbackKey: 'addNewBlock'
          },
          ...this.toolbox().contents
        ],
      };
      this.toolbox.set(newToolbox);
    }

    this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox: this.toolbox(),
      renderer: 'Zelos',
      grid: {
        colour: '#ccc',
        snap: true,
        spacing: 20,
        length: 3
      },
      trashcan: true,
      scrollbars: true,
    });

    this.workspace.addChangeListener((event) => {
      if (
        event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE
      ) {
        this.updateToolboxLimits(this.workspace);
      }
    })

    this.workspace.registerButtonCallback('addNewBlock', () => {
      this.openBlocksModal();
    })

    this.resizeBlockly();

    const jsonWorkspace = JSON.parse(this.activity()!.workspace);
    Blockly.serialization.workspaces.load(jsonWorkspace, this.workspace);
  }

  private resizeBlockly(): void {
    const blocklyArea = this.blocklyArea.nativeElement;
    const blocklyDiv = this.blocklyDiv.nativeElement;

    // Ensure Blockly workspace resizes properly with the area
    blocklyDiv.style.width = `${blocklyArea.offsetWidth}px`;
    blocklyDiv.style.height = `${blocklyArea.offsetHeight}px`;
    Blockly.svgResize(this.workspace); // Resize the workspace after adjusting the div size
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
      this.images.push({img, x: 50, y: 50, width: 100, height: 100});
      this.drawImages();
    };

    // Set up mouse event listeners for dragging
    this.setupMouseEvents();
  }

  private setupMouseEvents() {
    this.canvas.nativeElement.addEventListener('mousedown', (e: MouseEvent) => {
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;

      // Check if the mouse click is on one of the images
      for (let imgObj of this.images) {
        if (mouseX >= imgObj.x && mouseX <= imgObj.x + imgObj.width && mouseY >= imgObj.y && mouseY <= imgObj.y + imgObj.height) {
          this.draggingImage = imgObj;
          this.offsetX = mouseX - imgObj.x;
          this.offsetY = mouseY - imgObj.y;
        }
      }
    });

    this.canvas.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
      if (this.draggingImage) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Move the image based on mouse position
        this.draggingImage.x = mouseX - this.offsetX;
        this.draggingImage.y = mouseY - this.offsetY;

        this.drawImages();
      }
    });

    this.canvas.nativeElement.addEventListener('mouseup', () => {
      this.draggingImage = null;
    });

    this.canvas.nativeElement.addEventListener('mouseleave', () => {
      this.draggingImage = null;
    });
  }


  private drawImages() {
    if (!this.ctx) return;

    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Draw each image on the canvas
    for (let imgObj of this.images) {
      this.ctx.drawImage(imgObj.img, imgObj.x, imgObj.y, imgObj.width, imgObj.height);
    }
  }
}
