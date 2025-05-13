import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'blearn-scene-input',
  imports: [
    FormsModule
  ],
  templateUrl: './scene-input.component.html',
})
export class SceneInputComponent {
  @Input() label!: string;
  @Input() value!: number;

  @Output() valueChange = new EventEmitter<number>();

  onChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    const parsed = parseFloat(inputElement.value);
    if (!isNaN(parsed)) this.valueChange.emit(parsed);
  }
}
