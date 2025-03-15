import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as Blockly from 'blockly';
import 'blockly/blocks';

@Component({
  selector: 'blearn-blockly-editor',
  imports: [],
  templateUrl: './blockly-editor.component.html',
})
export class BlocklyEditorComponent implements AfterViewInit {
  @ViewChild('blocklyDiv') blocklyDiv!: ElementRef;

  ngAfterViewInit(): void {
    Blockly.inject(this.blocklyDiv.nativeElement, {
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
  }
}
