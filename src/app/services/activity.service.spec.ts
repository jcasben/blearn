import {TestBed} from '@angular/core/testing';

import {ActivityService} from './activity.service';
import {beforeEach, describe, it, jest, expect} from '@jest/globals';
import {BrowserStorageService} from './browser-storage.service';
import {Activity} from '../models/activity';

describe('ActivityService', () => {
  let service: ActivityService;
  let browserStorageService: jest.Mocked<BrowserStorageService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActivityService,
        BrowserStorageService
      ]
    });

    service = TestBed.inject(ActivityService);
    browserStorageService = TestBed.inject(BrowserStorageService) as jest.Mocked<BrowserStorageService>

    browserStorageService.loadData = jest.fn();
    browserStorageService.saveData = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save the activities', () => {
    // given
    const mockActivities: Activity[] = [{
      id: '1',
      title: 'Activity 1',
      description: 'Description',
      dueDate: '1/1/2000'
    }];

    // when
    service.saveActivities(mockActivities);

    // then
    expect(browserStorageService.saveData).toHaveBeenCalledWith('studentActivities', mockActivities);
  })

  it('should load activities', () => {
    // given
    const mockActivities: Activity[] = [{
      id: '1',
      title: 'Activity 1',
      description: 'Description',
      dueDate: '1/1/2000'
    }];
    browserStorageService.loadData.mockReturnValue(mockActivities);

    // when
    const loadedActivities = service.loadActivities();

    //then
    expect(loadedActivities).toEqual(mockActivities);
  });

  it('should return empty array when no activities saved', () => {
    // given
    browserStorageService.loadData.mockReturnValue(null);

    // when
    const loadedActivities = service.loadActivities();

    // then
    expect(loadedActivities).toEqual([]);
  });

  it('should add an activity', () => {
    // given
    const newActivity: Activity = {
      id: '2',
      title: 'Activity 2',
      description: 'Description 2',
      dueDate: '2/2/2000'
    };
    const existingActivities: Activity[] = [{
      id: '1',
      title: 'Activity 1',
      description: 'Description',
      dueDate: '1/1/2000'
    }];

    browserStorageService.loadData.mockReturnValue(existingActivities);

    // when
    service.addActivity(newActivity);

    // then
    expect(browserStorageService.saveData).toHaveBeenCalledWith('studentActivities', [
        {
          id: '1',
          title: 'Activity 1',
          description: 'Description',
          dueDate: '1/1/2000'
        },
        {
          id: '2',
          title: 'Activity 2',
          description: 'Description 2',
          dueDate: '2/2/2000'
        }
      ]
    );
  });
});
