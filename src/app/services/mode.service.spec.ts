import {beforeEach, describe, expect, it} from '@jest/globals';
import {ModeService} from './mode.service';
import {BrowserStorageService} from './browser-storage.service';
import {TestBed} from '@angular/core/testing';

describe('ModeService', () => {
  let service: ModeService;
  let browserStorageMock: jest.Mocked<BrowserStorageService>;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [BrowserStorageService]})
    browserStorageMock = TestBed.inject(BrowserStorageService) as jest.Mocked<BrowserStorageService>
    service = new ModeService(browserStorageMock);
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
