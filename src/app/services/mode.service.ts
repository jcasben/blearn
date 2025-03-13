import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private mode = signal<'student' | 'teacher'>('student');

  // Method to set the mode
  setMode(mode: 'student' | 'teacher') {
    this.mode.set(mode);
  }

  // Method to get the current mode
  getMode(): 'student' | 'teacher' {
    return this.mode();
  }
}
