import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import * as Blockly from 'blockly';
import blocks from '../../assets/blocks.json';

@Component({
  selector: 'blearn-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor() {
    Blockly.defineBlocksWithJsonArray(blocks);
  }
}
