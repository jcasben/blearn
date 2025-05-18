import { Injectable } from '@angular/core';
import * as Blockly from 'blockly';
import blocks from '../../../assets/blocks.json';
import {javascriptGenerator} from 'blockly/javascript';

@Injectable({
  providedIn: 'root'
})
export class BlocklyService {
  defineCustomBlocks() {
    Blockly.defineBlocksWithJsonArray(blocks);
  }

  defineCodeGenerationForCustomBlocks() {
    javascriptGenerator.forBlock['event_start'] = function () {
      return `// Start of the program\n`;
    };

    javascriptGenerator.forBlock['movement_jump'] = function (block: any) {
      const x = block.getFieldValue('x');
      const y = block.getFieldValue('y');
      return `moveTo(${x}, ${y});\n`;
    };

    javascriptGenerator.forBlock['movement_forward'] = function(block: any) {
      const steps = block.getFieldValue('steps');
      return `moveForward(${steps});\n`;
    };

    javascriptGenerator.forBlock['movement_set_direction'] = function(block: any){
      const angle = block.getFieldValue('angle');
      return `setDirection(${angle});\n`;
    };

    javascriptGenerator.forBlock['movement_turn_left'] = function (block: any) {
      const angle = block.getFieldValue('angle');
      return `turnLeft(${angle});\n`;
    };

    javascriptGenerator.forBlock['movement_turn_right'] = function (block: any) {
      const angle = block.getFieldValue('angle');
      return `turnRight(${angle});\n`;
    };

    javascriptGenerator.forBlock['controls_wait'] = function(block: any) {
      const seconds = block.getFieldValue('seconds');
      return `waitSeconds(${seconds});\n`;
    };

    javascriptGenerator.forBlock['controls_repeat_forever'] = function(block: any) {
      const innerCode = javascriptGenerator.statementToCode(block, 'statement');
      return `while (true) {\n${innerCode}}\n`;
    }

    javascriptGenerator.forBlock['movement_set_direction'] = function (block: any) {
      const direction = block.getFieldValue('direction');
      return `setDirection("${direction}")\n`;
    }
  }
}
