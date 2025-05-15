import {Injectable, signal} from '@angular/core';
import {BrowserStorageService} from './browser-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private mode = signal<'student' | 'teacher'>('student');

  constructor(public browserStorage: BrowserStorageService) {
    const localMode = browserStorage.loadData('mode');
    if (localMode) this.setMode(localMode);
  }


  // Method to set the mode
  setMode(mode: 'student' | 'teacher') {
    this.mode.set(mode);
    this.browserStorage.saveData('mode', mode);
  }

  // Method to get the current mode
  getMode(): 'student' | 'teacher' {
    return this.mode();
  }
}
