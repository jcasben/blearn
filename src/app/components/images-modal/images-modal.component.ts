import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonComponent} from "../../layout/button/button.component";
import {NgClass} from '@angular/common';

@Component({
  selector: 'blearn-images-modal',
  imports: [
    ButtonComponent,
    NgClass
  ],
  templateUrl: './images-modal.component.html',
})
export class ImagesModalComponent {
  @Input() backgrounds = false;
  @Output() imageSelected = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  protected backgroundPaths = [
    '/backgrounds/desert.webp',
    '/backgrounds/forest.webp',
    '/backgrounds/winter.webp',
    '/backgrounds/underwater.webp',
  ];

  protected charactersPaths = [
    '/characters/cat.webp',
    '/characters/dog.png',
    '/characters/bird.png',
    '/characters/turtle.png',
    '/characters/fish.png',
  ];
}
