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
import * as Blockly from 'blockly';
import {WorkspaceSvg} from 'blockly';
import 'blockly/blocks';
import {ModeService} from '../../services/mode.service';

@Component({
  selector: 'blearn-blockly-editor',
  imports: [],
  templateUrl: './blockly-editor.component.html',
})
export class BlocklyEditorComponent implements AfterViewInit {
  private modeService = inject(ModeService);

  @ViewChild('blocklyDiv') blocklyDiv!: ElementRef;
  //@ViewChild('blocklyArea') blocklyArea!: ElementRef;

  @Input() toolbox = signal({
    kind: 'flyoutToolbox',
    contents: [
      {kind: '', text: '', callbackKey: ''},
      {kind: '', type: ''},
    ]
  });
  @Input() workspaceJSON!: string;
  @Input() BLOCKS_LIMITS: Map<string, number> = new Map<string, number>();
  @Output() openModal = new EventEmitter<void>();
  @Output() updateLimits = new EventEmitter<void>();
  @Output() saveWorkspace = new EventEmitter<void>();

  private workspace!: Blockly.WorkspaceSvg;

  ngAfterViewInit(): void {
    this.initBlockly();
  }

  private initBlockly() {
    if (this.modeService.getMode() === 'teacher') {
      const newToolbox = {
        ...this.toolbox(),
        contents: [
          {
            kind: 'button',
            text: 'Add / Remove blocks',
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
        this.updateLimits.emit();
      }
      this.saveWorkspace.emit();
    });

    this.workspace.registerButtonCallback('addNewBlock', () => {
      //this.openBlocksModal();
      this.openModal.emit();
    });

    //this.resizeBlockly();

    const jsonWorkspace = JSON.parse(this.workspaceJSON);
    Blockly.serialization.workspaces.load(jsonWorkspace, this.workspace);
  }

  public getWorkspace(): WorkspaceSvg {
    return this.workspace;
  }
}
