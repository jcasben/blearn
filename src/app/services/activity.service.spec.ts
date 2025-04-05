import {TestBed} from '@angular/core/testing';

import {ActivityService} from './activity.service';
import {beforeEach, describe, it, jest, expect} from '@jest/globals';
import {BrowserStorageService} from './browser-storage.service';
import {Activity} from '../models/activity';
import {ModeService} from './mode.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let browserStorageService: jest.Mocked<BrowserStorageService>;
  let modeService: jest.Mocked<ModeService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ActivityService,
        BrowserStorageService,
        ModeService,
      ]
    });

    service = TestBed.inject(ActivityService);
    browserStorageService = TestBed.inject(BrowserStorageService) as jest.Mocked<BrowserStorageService>;
    modeService = TestBed.inject(ModeService) as jest.Mocked<ModeService>;

    browserStorageService.loadData = jest.fn();
    browserStorageService.saveData = jest.fn();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save the activities in studentActivities when in student mode', () => {
    // given
    const mockActivities: Activity = {
      id: '1',
      title: 'Activity 1',
      description: 'Description',
      dueDate: '1/1/2000',
      workspace: '{}',
      toolboxInfo: {
        toolboxDefinition: '',
        BLOCK_LIMITS: {}
      }
    };
    modeService.setMode('student');

    // when
    service.addActivity(mockActivities);

    // then
    expect(browserStorageService.saveData).toHaveBeenCalledWith('studentActivities', [mockActivities]);
  })

  it('should save the activities in teacherActivities when in teacher mode', () => {
    // given
    const mockActivities: Activity = {
      id: '1',
      title: 'Activity 1',
      description: 'Description',
      dueDate: '1/1/2000',
      workspace: '{}',
      toolboxInfo: {
        toolboxDefinition: '',
        BLOCK_LIMITS: {}
      }
    };
    modeService.setMode('teacher');

    // when
    service.addActivity(mockActivities);

    // then
    expect(browserStorageService.saveData).toHaveBeenCalledWith('teacherActivities', [mockActivities]);
  })

  it('should load activities', () => {
    // given
    const mockActivities: Activity[] = [{
      id: '1',
      title: 'Activity 1',
      description: 'Description',
      dueDate: '1/1/2000',
      workspace: '{}',
      toolboxInfo: {
        toolboxDefinition: '',
        BLOCK_LIMITS: {}
      }
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
      dueDate: '2/2/2000',
      workspace: '{}',
      toolboxInfo: {
        toolboxDefinition: '',
        BLOCK_LIMITS: {}
      }
    };
    const existingActivities: Activity[] = [{
      id: '1',
      title: 'Activity 1',
      description: 'Description',
      dueDate: '1/1/2000',
      workspace: '{}',
      toolboxInfo: {
        toolboxDefinition: '',
        BLOCK_LIMITS: {}
      }
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
          dueDate: '1/1/2000',
          workspace: '{}',
          toolbox: {
            toolboxDefinition: '',
            BLOCK_LIMITS: {}
          }
        },
        {
          id: '2',
          title: 'Activity 2',
          description: 'Description 2',
          dueDate: '2/2/2000',
          workspace: '{}',
          toolbox: {
            toolboxDefinition: '',
            BLOCK_LIMITS: {}
          }
        }
      ]
    );
  });

  it('should get the correct activity given the id', () => {
    // given
    const existingActivities: Activity[] = [
      {
        id: '1',
        title: 'Activity 1',
        description: 'Description',
        dueDate: '1/1/2000',
        workspace: '{}',
        toolboxInfo: {
          toolboxDefinition: '',
          BLOCK_LIMITS: {}
        }
      },
      {
        id: '2',
        title: 'Activity 2',
        description: 'Description 2',
        dueDate: '2/2/2000',
        workspace: '{}',
        toolboxInfo: {
          toolboxDefinition: '',
          BLOCK_LIMITS: {}
        }
      }
    ];
    browserStorageService.loadData.mockReturnValue(existingActivities);

    // when
    const activity = service.getActivity('2');

    // then
    expect(activity).toEqual(
      {
        id: '2',
        title: 'Activity 2',
        description: 'Description 2',
        dueDate: '2/2/2000',
        workspace: '{}',
        toolbox: {
          toolboxDefinition: '',
          BLOCK_LIMITS: {}
        }
      }
    );
  });

  it('should update existing activity', () => {
    // given
    const mockActivity: Activity = {
      id: '1',
      title: 'Activity 1',
      description: 'Description',
      dueDate: '1/1/2000',
      workspace: '{}',
      toolboxInfo: {
        toolboxDefinition: '',
        BLOCK_LIMITS: {}
      }
    };
    browserStorageService.loadData.mockReturnValue([mockActivity]);

    // when
    mockActivity.title = 'Updated Activity';
    service.updateActivity('1', mockActivity);

    // then
    expect(service.getActivity('1')).toEqual(mockActivity);
  });

  it('should delete activity by id', () => {
    // given
    let mockActivity: Activity[] = [
      {
        id: '1',
        title: 'Activity 1',
        description: 'Description',
        dueDate: '1/1/2000',
        workspace: '{}',
        toolboxInfo: {
          toolboxDefinition: '',
          BLOCK_LIMITS: {}
        }
      }
    ];
    browserStorageService.loadData.mockImplementation(() => mockActivity);
    browserStorageService.saveData.mockImplementation((_key, newData) => {
      mockActivity = newData; // Simulates data persistence
    });

    // when
    service.deleteActivity('1');

    // then
    expect(service.loadActivities()).toEqual([]);
  });
});
