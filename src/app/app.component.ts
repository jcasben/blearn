import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './layout/header/header.component';
import {FooterComponent} from './layout/footer/footer.component';
import {BlocklyService} from './services/blockly.service';

@Component({
  selector: 'blearn-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(blocklyService: BlocklyService) {
    blocklyService.defineCustomBlocks();
    blocklyService.defineCodeGenerationForCustomBlocks();
  }
}
