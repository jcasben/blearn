import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import * as Blockly from 'blockly';
import 'blockly/blocks';

@Component({
  selector: 'blearn-blockly-editor',
  imports: [],
  templateUrl: './blockly-editor.component.html',
})
export class BlocklyEditorComponent implements AfterViewInit {
  @ViewChild('blocklyDiv') blocklyDiv!: ElementRef;
  @ViewChild('blocklyArea') blocklyArea!: ElementRef;
  @Input() workspaceJSON!: string;
  private workspace!: Blockly.WorkspaceSvg;

  ngAfterViewInit(): void {
    this.initBlockly();
  }

  private initBlockly() {
    this.workspace = Blockly.inject(this.blocklyDiv.nativeElement, {
      toolbox: {
        kind: 'flyoutToolbox',
        contents: [
          {
            kind: 'block',
            type: 'procedures_defnoreturn'
          },
          {
            kind: 'block',
            type: 'text_print'
          },
          {
            kind: 'block',
            type: 'text_print'
          },
          {
            kind: 'block',
            type: 'controls_if'
          },
          {
            kind: 'block',
            type: 'controls_whileUntil'
          }
        ],
      },
      grid: {
        colour: '#ccc',
        snap: true,
        spacing: 20,
        length: 3
      },
      trashcan: true,
      scrollbars: true,
    });

    const jsonWorkspace = JSON.parse(this.workspaceJSON);
    Blockly.serialization.workspaces.load(jsonWorkspace, this.workspace);
  }

  saveWorkspaceAsJson(): string {
    const jsonWorkspace = Blockly.serialization.workspaces.save(this.workspace);
    return JSON.stringify(jsonWorkspace);
  }
}
