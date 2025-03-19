import {Component, ElementRef, EventEmitter, HostListener, inject, Input, Output, ViewChild} from '@angular/core';
import {Activity} from '../../models/activity';
import {RouterLink} from '@angular/router';
import {ActivityService} from '../../services/activity.service';

@Component({
  selector: 'blearn-activity',
  imports: [
    RouterLink
  ],
  templateUrl: './activity.component.html',
})
export class ActivityComponent {
  protected activityService = inject(ActivityService);

  @Input() activity!: Activity
  @Output() deleteActivityEmitter = new EventEmitter<string>();

  @ViewChild('menuButton') menuButton!: ElementRef;
  @ViewChild('dropdown') dropdownMenu!: ElementRef;

  menuOpen: boolean = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (
      this.menuButton && !this.menuButton.nativeElement.contains(event.target) &&
      this.dropdownMenu && !this.dropdownMenu.nativeElement.contains(event.target)
    ) {
      this.menuOpen = false;
    }
  }

  deleteActivity() {
    if (confirm(`Are you sure that you want to delete "${this.activity.title}"?`)) {
      this.deleteActivityEmitter.emit(this.activity.id);
    }
  }
}
