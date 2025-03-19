import {Component, computed, inject, signal, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivityService} from '../../services/activity.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {BlocklyEditorComponent} from '../../components/blockly-editor/blockly-editor.component';
import {Activity} from '../../models/activity';
import {FormsModule} from '@angular/forms';
import {ModeService} from '../../services/mode.service';
import {TitleComponent} from '../../components/title/title.component';
import {ButtonComponent} from '../../components/button/button.component';

@Component({
  selector: 'blearn-activity-detail',
  imports: [
    BlocklyEditorComponent,
    FormsModule,
    TitleComponent,
    ButtonComponent
  ],
  templateUrl: './activity-detail.component.html',
})
export class ActivityDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  protected modeService = inject(ModeService);
  private router = inject(Router);

  @ViewChild(BlocklyEditorComponent) blocklyEditorComponent!: BlocklyEditorComponent;

  private activityId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') || null)
    )
  );

  protected activity = signal<Activity | null>(null);

  constructor() {
    const computedActivity = computed(() => {
      const id = this.activityId();
      if (!id) {
        this.router.navigate(['/']).then();
        return null;
      }

      const activity = this.activityService.getActivity(id);
      if (!activity) {
        this.router.navigate(['/']).then();
        return null;
      }

      return activity;
    });

    this.activity.set(computedActivity());
  }

  updateTitle(newTitle: string) {
    if (this.activity()) {
      this.activity.set({ ...this.activity()!, title: newTitle });
      this.activityService.updateActivity(this.activityId()!, this.activity()!);
    }
  }

  saveWorkspace() {
    const workspaceJSON = this.blocklyEditorComponent.saveWorkspaceAsJson();
    this.activity.set({ ...this.activity()!, workspace: workspaceJSON });
    this.activityService.updateActivity(this.activityId()!, this.activity()!);
  }

  downloadFile() {
    const fileName = `${this.activity()!.title}.blearn`
    const content = JSON.stringify(this.activity()!);

    const file = new Blob([content], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    link.remove();
  }
}
