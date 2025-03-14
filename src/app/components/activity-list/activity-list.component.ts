import { Component } from '@angular/core';
import {Activity} from '../../models/activity';
import {ActivityComponent} from '../activity/activity.component';

@Component({
  selector: 'blearn-activity-list',
  imports: [
    ActivityComponent
  ],
  templateUrl: './activity-list.component.html',
})
export class ActivityListComponent {
  protected activityList: Activity[] = [
    {
      id: '1',
      title: 'Title',
      description: 'Description',
      dueDate: ''
    },
    {
      id: '2',
      title: 'Title',
      description: 'Description',
      dueDate: ''
    },
    {
      id: '3',
      title: 'Title',
      description: 'Description',
      dueDate: ''
    },
    {
      id: '4',
      title: 'Title',
      description: 'Description',
      dueDate: ''
    },
  ]
}
