import {inject, Injectable} from '@angular/core';
import {BrowserStorageService} from './browser-storage.service';
import {Activity} from '../models/activity';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly storageKey = "studentActivities";
  private browserStorageService = inject(BrowserStorageService);

  saveActivities(activities: Activity[]): void {
    this.browserStorageService.saveData(this.storageKey, activities);
  }

  loadActivities(): Activity[] {
    return this.browserStorageService.loadData(this.storageKey) || [];
  }

  addActivity(activity: Activity): void {
    const activities = this.loadActivities();
    activities.push(activity);
    this.saveActivities(activities);
  }

  deleteActivity(id: string): void {
    const activities = this.loadActivities();
    const updatedActivities = activities.filter((act) => act.id !== id);
    this.saveActivities(updatedActivities);
  }
}
