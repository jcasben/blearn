import {Component, Input} from '@angular/core';
import {Activity} from '../../models/activity';

@Component({
  selector: 'blearn-activity',
  imports: [],
  templateUrl: './activity.component.html',
})
export class ActivityComponent {
  @Input() activity!: Activity
}
