import {
  AfterViewInit,
  Component,
  computed,
  inject,
  OnDestroy,
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
import {DescriptionModalComponent} from '../../components/description-modal/description-modal.component';
import {NgClass} from '@angular/common';
import {SceneComponent} from '../../components/scene/scene.component';
import {javascriptGenerator} from 'blockly/javascript';
import {SceneObject} from '../../models/scene-object';
import genUniqueId from '../../utils/genUniqueId';

@Component({
  selector: 'blearn-activity-detail',
  imports: [
    BlocklyEditorComponent,
    FormsModule,
    TitleComponent,
    ButtonComponent,
    NgClass,
    SceneComponent,
  ],
  templateUrl: './activity-detail.component.html',
})
export class ActivityDetailComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  protected activityService = inject(ActivityService);
  protected modeService = inject(ModeService);
  private router = inject(Router);

  @ViewChild(BlocklyEditorComponent) blocklyEditorComponent!: BlocklyEditorComponent;
  @ViewChild(SceneComponent) sceneComponent!: SceneComponent;
  @ViewChild('modalHost', {read: ViewContainerRef}) modalHost!: ViewContainerRef;

  protected workspace!: Blockly.WorkspaceSvg;
  protected toolbox = signal({
    kind: 'flyoutToolbox',
    contents: [
      {kind: '', text: '', callbackKey: ''},
      {kind: '', type: ''},
    ]
  });
  protected selectedObject = signal<string | undefined>(undefined);

  protected readonly BLOCK_LIMITS: Map<string, number>;

  private runningInterpreters = 0;
  protected isRunning = signal<boolean>(false);

  public objectsCode = new Map<string, string>();

  private activityId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') || null)
    )
  );
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
    this.toolbox.set(JSON.parse(this.activity()!.toolboxInfo.toolboxDefinition));
    this.BLOCK_LIMITS = new Map<string, number>(Object.entries(this.activity()!.toolboxInfo.BLOCK_LIMITS));

    if (this.activity()!.sceneObjects.length > 0) {

      const restoredObjects = this.activity()!.sceneObjects.map(obj =>
        new SceneObject(obj.id, obj.imgSrc, obj.x, obj.y, obj.rotation, obj.width, obj.height, obj.workspace)
      );

      this.activity.set({...this.activity()!, sceneObjects: restoredObjects});
    }
  }

  ngAfterViewInit(): void {
    this.workspace = this.blocklyEditorComponent.getWorkspace();
    const jsonWorkspace = JSON.stringify(Blockly.serialization.workspaces.save(this.workspace));
    this.activity.set({...this.activity()!, workspace: jsonWorkspace});

    if (this.activity()!.sceneObjects.length > 0) {
      this.activity()!.sceneObjects.forEach(sceneObject => this.generateCode(sceneObject));
      this.selectSceneObject(this.activity()!.sceneObjects[0].id);
    }
  }

  ngOnDestroy(): void {
    this.saveWorkspace(true);
  }

  public findSceneObjectById(id: string): SceneObject | undefined {
    return this.activity()!.sceneObjects.find(obj => obj.id === id);
  }

  protected createSceneObject() {
    const img = new Image();
    img.src = 'https://avatars.githubusercontent.com/u/105555875?v=4';
    img.onload = () => {
      const newObject: SceneObject = new SceneObject(
        genUniqueId(),
        img.src,
        0,
        0,
        0,
        100,
        100,
        this.activity()!.workspace,
        img
      );

      Blockly.serialization.workspaces.load(JSON.parse(newObject.workspace), this.workspace);
      this.workspace.updateToolbox(this.toolbox());

      this.selectedObject.set(newObject.id);

      console.log(this.objectsCode);

      this.activity()!.sceneObjects.push(newObject);
      this.sceneComponent.drawImages();
    }
  }

  protected selectSceneObject(id: string) {
    this.saveWorkspace(false);
    this.selectedObject.set(id);

    const obj = this.findSceneObjectById(id);
    Blockly.serialization.workspaces.load(JSON.parse(obj!.workspace), this.workspace);

    this.sceneComponent.drawImages();
  }

  protected openBlocksModal() {
    if (this.activity()!.sceneObjects.length === 0) {
      alert('You need to create an object to start adding blocks');
      return;
    }

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
    modalRef.instance.close.subscribe(() => {
      this.saveWorkspace(false);
      modalRef.destroy();
    });
  }

  protected openDescriptionModal() {
    const modalRef = this.modalHost.createComponent(DescriptionModalComponent);
    modalRef.instance.activity = this.activity;

    modalRef.instance.dueDateUpdated.subscribe(dueDate => this.updateDueDate(dueDate));
    modalRef.instance.descriptionUpdated.subscribe(description => this.updateDescription(description));
    modalRef.instance.close.subscribe(() => modalRef.destroy());
  }

  protected updateToolboxLimits(workspace: Blockly.WorkspaceSvg) {
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

  protected updateTitle(newTitle: string) {
    if (this.activity()) {
      this.activity.set({...this.activity()!, title: newTitle});
      this.activityService.updateActivity(this.activityId()!, this.activity()!);
    }
  }

  protected updateDueDate(newDueDate: string) {
    if (this.activity()) {
      this.activity.set({...this.activity()!, dueDate: newDueDate});
      this.activityService.updateActivity(this.activityId()!, this.activity()!);
    }
  }

  protected updateDescription(newDescription: string) {
    if (this.activity()) {
      this.activity.set({...this.activity()!, description: newDescription});
      this.activityService.updateActivity(this.activityId()!, this.activity()!);
    }
  }

  saveWorkspace(onStorage: boolean) {
    if (this.selectedObject) {
      javascriptGenerator.init(this.workspace);
      const startBlock = this.workspace.getTopBlocks(true)
        .find(block => block.type === 'event_start');

      if (startBlock) {
        const code = javascriptGenerator.blockToCode(startBlock) as string;
        this.objectsCode.set(this.selectedObject()!, code);
      }
    }

    const jsonWorkspace = Blockly.serialization.workspaces.save(this.workspace);
    //if (onStorage && this.modeService.getMode() === 'teacher') this.toolbox().contents.shift();
    const jsonToolbox = JSON.stringify(this.toolbox());
    const workspaceJSON = JSON.stringify(jsonWorkspace);

    if (this.selectedObject()) {
      const obj = this.findSceneObjectById(this.selectedObject()!);
      obj!.workspace = workspaceJSON;
    }
    //this.activity.set({
    //  ...this.activity()!,
    //  workspace: workspaceJSON,
    //  toolboxInfo: {BLOCK_LIMITS: Object.fromEntries(this.BLOCK_LIMITS), toolboxDefinition: jsonToolbox}
    //});
    //if (onStorage) this.activityService.updateActivity(this.activityId()!, this.activity()!);
  }

  protected onRunCode() {
    this.runningInterpreters = this.objectsCode.size;

    this.objectsCode.forEach((v, k) => {
      console.log('Executing code of object with id ', k);
      this.isRunning.set(true);
      this.runInterpreter(v, k);
    });
  }

  runInterpreter(code: string, id: string) {
    const interpreterInstance = new Interpreter(code, this.initApi(id));
    this.stepExecution(interpreterInstance);
  }

  private initApi(id: string) {
    return (interpreter: Interpreter, globalObject: any) => {
      const object = this.findSceneObjectById(id);
      if (!object) return;

      const addFunction = (name: string, fn: Function) => {
        interpreter.setProperty(
          globalObject,
          name,
          interpreter.createNativeFunction(fn.bind(object))
        );
      };

      addFunction('moveForward', object.moveForward);
      addFunction('moveTo', object.moveTo);
      addFunction('setDirection', object.setDirection)
      addFunction('turnLeft', object.turnLeft);
      addFunction('turnRight', object.turnRight);

      interpreter.setProperty(
        globalObject,
        'waitSeconds',
        interpreter.createAsyncFunction((seconds: number, callback: Function) => {
          setTimeout(() => callback(), seconds * 1000);
        })
      );
    };
  }

  private stepExecution(interpreter: Interpreter) {
    if (!this.isRunning()) return;

    const hasMoreCode = interpreter.step();
    if (hasMoreCode) {
      this.sceneComponent.drawImages();
      setTimeout(() => this.stepExecution(interpreter), 0.1);
    } else {
      this.runningInterpreters--;

      if (this.runningInterpreters === 0) {
        this.isRunning.set(false);
        console.log('Execution finished');
      }
    }
  }
}
