import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivityService} from '../../services/activity.service';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';
import {BlocklyEditorComponent} from '../../components/blockly-editor/blockly-editor.component';
import {TitleComponent} from '../../components/title/title.component';

@Component({
  selector: 'blearn-activity-detail',
  imports: [
    BlocklyEditorComponent,
    TitleComponent
  ],
  templateUrl: './activity-detail.component.html',
})
export class ActivityDetailComponent {
  private route = inject(ActivatedRoute);
  private activityService = inject(ActivityService);
  private router = inject(Router);

  private activityId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') || null)
    )
  );

  protected activity = computed(() => {
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
}
