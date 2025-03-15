import {Component, Input, signal} from '@angular/core';
import {Activity} from '../../models/activity';
import {ActivityComponent} from '../activity/activity.component';
import {TitleComponent} from '../title/title.component';

@Component({
  selector: 'blearn-activity-list',
  imports: [
    ActivityComponent,
    TitleComponent
  ],
  templateUrl: './activity-list.component.html',
})
export class ActivityListComponent {
  @Input() activityList = signal<Activity[]>([]);
}
