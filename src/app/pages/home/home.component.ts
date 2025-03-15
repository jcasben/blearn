import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {ModeService} from "../../services/mode.service";
import {ButtonComponent} from '../../components/button/button.component';
import {TitleComponent} from '../../components/title/title.component';
import {ActivityService} from '../../services/activity.service';
import genUniqueId from '../../utils/genUniqueId';
import {Activity} from '../../models/activity';
import {ActivityListComponent} from '../../components/activity-list/activity-list.component';

@Component({
  selector: 'blearn-home',
  imports: [
    ButtonComponent,
    TitleComponent,
    ActivityListComponent
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected modeService = inject(ModeService);
  protected activityService = inject(ActivityService);

  protected activityList = signal<Activity[]>([]);

  constructor() {
    effect(() => {
      this.modeService.getMode();
      this.activityList.set(this.activityService.loadActivities());
    });
  }

  addActivity() {
    if (this.modeService.getMode() === 'teacher') {
      const newActivity: Activity = {
        id: genUniqueId(),
        title: 'Untitled',
        description: '',
        dueDate: '',
      };
      this.activityService.addActivity(newActivity);
      this.activityList.set(this.activityService.loadActivities());
    }
  }
}
