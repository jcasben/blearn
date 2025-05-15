import {AfterViewInit, Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {ButtonComponent} from '../../layout/button/button.component';
import * as Blockly from 'blockly';

@Component({
  selector: 'blearn-blocks-modal',
  imports: [
    ButtonComponent
  ],
  templateUrl: './blocks-modal.component.html',
})
export class BlocksModalComponent implements AfterViewInit {
  @Input() BLOCKS_LIMIT: Map<string, number> = new Map<string, number>();
  @Output() blockAdded = new EventEmitter<string>();
  @Output() blockRemoved = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  protected blockTypes = [
    'event_start',
    'controls_repeat',
    'controls_repeat_forever',
    'controls_if',
    'controls_wait',
    'movement_jump',
    'movement_turn_left',
    'movement_turn_right',
    'movement_forward',
    'movement_set_direction'
  ];

  ngAfterViewInit(): void {
    this.renderBlocks()
  }

  private renderBlocks() {
    const list = document.querySelector('#list')!;
    this.blockTypes.forEach((block) => {
      const tmpWorkspace = Blockly.inject(document.getElementById(block)!, {
        toolbox: {
          kind: 'flyoutToolbox',
          contents: [
            {kind: '', type: ''},
          ]
        },
        readOnly: true,
        renderer: 'Zelos',
        scrollbars: false,
        move: {
          scrollbars: {horizontal: false, vertical: true},
          drag: false,
          wheel: false,
        },
        zoom: {
          controls: false,
          wheel: false,
        },
      });

      const rect = list.querySelectorAll("rect");
      rect.forEach((r) => {
        r.style.display = "none";
      });

      const newBlock = tmpWorkspace.newBlock(block);
      newBlock.initSvg();
      newBlock.render();
      tmpWorkspace.zoomToFit();
    });
  }

  protected addBlock(type: string) {
    this.blockAdded.emit(type);
  }

  protected removeBlock(type: string) {
    this.blockRemoved.emit(type);
  }

  protected onClose() {
    this.close.emit();
  }
}
