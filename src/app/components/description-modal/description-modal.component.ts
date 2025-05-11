import {Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {ButtonComponent} from '../../layout/button/button.component';
import {Activity} from '../../models/activity';
import {FormsModule} from '@angular/forms';
import {ModeService} from '../../services/mode.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'blearn-description-modal',
  imports: [
    ButtonComponent,
    FormsModule,
    DatePipe
  ],
  templateUrl: './description-modal.component.html',
})
export class DescriptionModalComponent {
  protected modeService = inject(ModeService);

  @Input() activity = signal<Activity | null>(null);
  @Output() close = new EventEmitter<void>();
  @Output() dueDateUpdated = new EventEmitter<string>();
  @Output() descriptionUpdated = new EventEmitter<string>();

  protected updateDueDate(newDate: string) {
    this.dueDateUpdated.emit(newDate);
  }

  protected updateDescription(newDescription: string) {
    this.descriptionUpdated.emit(newDescription);
  }
}
