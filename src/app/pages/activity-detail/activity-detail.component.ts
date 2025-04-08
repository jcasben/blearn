import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject, OnDestroy,
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
  @ViewChild('scene') scene!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  protected workspace!: Blockly.WorkspaceSvg;
  protected toolbox = signal({
    kind: 'flyoutToolbox',
    contents: [
      {kind: '', text: '', callbackKey: ''},
      {kind: '', type: ''},
    ]
  });

  protected readonly BLOCK_LIMITS: Map<string, number>;

  private interpreter: Interpreter | null = null;
  protected isRunning = signal<boolean>(false);

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
  }

  ngAfterViewInit(): void {
    this.workspace = this.blocklyEditorComponent.getWorkspace();
  }

  ngOnDestroy(): void {
    this.saveWorkspace(true);
  }

  protected openBlocksModal() {
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
    const jsonWorkspace = Blockly.serialization.workspaces.save(this.workspace);
    if (onStorage && this.modeService.getMode() === 'teacher') this.toolbox().contents.shift();
    const jsonToolbox = JSON.stringify(this.toolbox());
    const workspaceJSON = JSON.stringify(jsonWorkspace);
    this.activity.set({
      ...this.activity()!,
      workspace: workspaceJSON,
      toolboxInfo: {BLOCK_LIMITS: Object.fromEntries(this.BLOCK_LIMITS), toolboxDefinition: jsonToolbox}
    });
    if (onStorage) this.activityService.updateActivity(this.activityId()!, this.activity()!);
  }

  runInterpreter(code: string) {
    this.interpreter = new Interpreter(code, this.initApi.bind(this));
    this.stepExecution();
  }

  stepExecution() {
    if (!this.interpreter || !this.isRunning()) return;

    const hasMoreCode = this.interpreter.step();
    if (hasMoreCode) {
      setTimeout(() => this.stepExecution(), 0.5);
    } else {
      this.isRunning.set(false);
      console.log('Execution finished');
    }
  }

  initApi(interpreter: Interpreter, globalObject: any) {
    const addFunction = (name: string, fn: Function) => {
      interpreter.setProperty(
        globalObject,
        name,
        interpreter.createNativeFunction(fn.bind(this.sceneComponent))
      );
    };

    addFunction('moveForward', this.sceneComponent.moveForward);
    addFunction('moveTo', this.sceneComponent.moveTo);
    addFunction('setDirection', this.sceneComponent.setDirection)
    addFunction('turnLeft', this.sceneComponent.turnLeft);
    addFunction('turnRight', this.sceneComponent.turnRight);

    interpreter.setProperty(
      globalObject,
      'waitSeconds',
      interpreter.createAsyncFunction((seconds: number, callback: Function) => {
        setTimeout(() => callback(), seconds * 1000);
      })
    );
  }

  protected onRunCode() {
    javascriptGenerator.init(this.workspace);
    const startBlock = this.workspace.getTopBlocks(true)
      .find(block => block.type === 'event_start');

    if (!startBlock) {
      alert('You should start your program with the "Start program" block!');
      return;
    }
    const code = javascriptGenerator.blockToCode(startBlock) as string;
    console.log(code);

    this.isRunning.set(true);
    this.runInterpreter(code);
  }
}
