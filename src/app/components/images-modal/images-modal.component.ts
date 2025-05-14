import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonComponent} from "../../layout/button/button.component";
import {DatePipe} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'blearn-images-modal',
  imports: [
    ButtonComponent
  ],
  templateUrl: './images-modal.component.html',
})
export class ImagesModalComponent {
  @Output() close = new EventEmitter<void>();
}
