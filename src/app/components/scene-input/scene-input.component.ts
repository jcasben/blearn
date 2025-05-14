import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ModeService} from '../../services/mode.service';

@Component({
  selector: 'blearn-scene-input',
  imports: [
    FormsModule
  ],
  templateUrl: './scene-input.component.html',
})
export class SceneInputComponent {
  protected modeService = inject(ModeService);

  @Input() label!: string;
  @Input() value!: number;

  @Output() valueChange = new EventEmitter<number>();

  onChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    const parsed = parseFloat(inputElement.value);
    if (!isNaN(parsed)) this.valueChange.emit(parsed);
  }
}
