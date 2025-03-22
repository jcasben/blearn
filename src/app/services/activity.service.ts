import {computed, inject, Injectable} from '@angular/core';
import {BrowserStorageService} from './browser-storage.service';
import {Activity} from '../models/activity';
import {ModeService} from './mode.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private browserStorageService = inject(BrowserStorageService);
  private modeService = inject(ModeService);
  private readonly storageKey = computed(() => (this.modeService.getMode() === 'student' ? 'studentActivities' : 'teacherActivities'));

  saveActivities(activities: Activity[]): void {
    this.browserStorageService.saveData(this.storageKey(), activities);
  }

  loadActivities(): Activity[] {
    return this.browserStorageService.loadData(this.storageKey()) || [];
  }

  addActivity(activity: Activity): void {
    const activities = this.loadActivities();
    activities.push(activity);
    this.saveActivities(activities);
  }

  getActivity(id: string): Activity | null {
    const activities = this.loadActivities();
    return activities.find((act) => act.id === id) || null;
  }

  updateActivity(id: string, updatedActivity: Activity) {
    const activities = this.loadActivities();
    const index = activities.findIndex((act) => act.id === id);

    if (index === -1) return;
    activities[index] = {...activities[index], ...updatedActivity};
    this.saveActivities(activities);
  }

  deleteActivity(id: string): void {
    const activities = this.loadActivities();
    const updatedActivities = activities.filter((act) => act.id !== id);
    this.saveActivities(updatedActivities);
  }

  downloadActivity(activity: Activity) {
    const fileName = `${activity.title}.blearn`
    const content = JSON.stringify(activity);

    const file = new Blob([content], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    link.remove();
  }
}
