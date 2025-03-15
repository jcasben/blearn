import {Component, inject, Input} from '@angular/core';
import {Activity} from '../../models/activity';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'blearn-activity',
  imports: [
    RouterLink
  ],
  templateUrl: './activity.component.html',
})
export class ActivityComponent {
  private router = inject(Router);
  @Input() activity!: Activity

  navigateToDetail() {
    this.router.navigate([`/activity/${this.activity.id}`]).then();
  }
}
