import {beforeEach, describe, expect, it} from '@jest/globals';
import {ModeService} from './mode.service';

describe('ModeService', () => {
  let service: ModeService;

  beforeEach(() => {
    service = new ModeService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start in student mode', () => {
    expect(service.getMode()).toBe('student');
  });

  it('should change to teacher mode', () => {
    // when
    service.setMode('teacher');

    // then
    expect(service.getMode()).toBe('teacher');
  });

  it('should change back to student', () => {
    // given
    service.setMode('teacher');

    // when
    service.setMode('student');

    // then
    expect(service.getMode()).toBe('student');
  });
});
