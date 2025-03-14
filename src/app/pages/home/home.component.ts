import {Component, inject} from '@angular/core';
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

  createActivity() {
    const newActivity: Activity = {
     id: genUniqueId(),
     title: 'Untitled',
     description: '',
     dueDate: '',
    }
  }
}
