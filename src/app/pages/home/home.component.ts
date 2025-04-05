import {Component, effect, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

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
        workspace: '{}',
        toolbox: '{"kind": "flyoutToolbox", "contents": [{ "kind": "", "text": "", "callbackKey": ""}, {"kind": "", "type": ""}]}'
      };
      this.activityService.addActivity(newActivity);
      this.activityList.set(this.activityService.loadActivities());
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  deleteActivity(id: string) {
    this.activityService.deleteActivity(id);
    this.activityList.set(this.activityService.loadActivities());
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (!file.name.endsWith('.blearn')) {
      alert('Invalid file type. Please upload a .blearn file');
      return;
    }

    let newActivity: Activity;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        newActivity = this.mapToActivity(jsonData);
        this.activityService.addActivity(newActivity);
        this.activityList.set(this.activityService.loadActivities());
      } catch (error) {
        console.error('Error parsing the file: ', error);
        alert('Invalid file content. Please, try again with a BLearn activity file');
      }
    };

    reader.readAsText(file);
  }

  private mapToActivity(jsonData: any): Activity {
    return {
      id: jsonData.id,
      title: jsonData.title,
      description: jsonData.description,
      dueDate: jsonData.dueDate,
      workspace: jsonData.workspace,
      toolbox: jsonData.toolbox,
    }
  }
}
