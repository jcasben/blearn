import {ActivityService} from '../../services/activity.service';
import {ModeService} from '../../services/mode.service';
import {fireEvent, render, screen, waitFor} from '@testing-library/angular';
import {HomeComponent} from './home.component';
import {ButtonComponent} from '../../layout/button/button.component';
import {TitleComponent} from '../../components/title/title.component';
import {ActivityListComponent} from '../../components/activity-list/activity-list.component';
import {userEvent} from '@testing-library/user-event';
import {By} from '@angular/platform-browser';

describe('HomeComponent', () => {
  let activityServiceMock: jest.Mocked<ActivityService>;
  let modeServiceMock: jest.Mocked<ModeService>;

  beforeEach(() => {
    modeServiceMock = {
      getMode: jest.fn(),
      setMode: jest.fn(),
    } as unknown as jest.Mocked<ModeService>;
    activityServiceMock = {
      loadActivities: jest.fn(),
      addActivity: jest.fn(),
      deleteActivity: jest.fn(),
    } as unknown as jest.Mocked<ActivityService>;
  });

  it('should render the component', async () => {
    await render(HomeComponent, {
      providers: [
        {provide: ActivityService, useValue: activityServiceMock},
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [
        ButtonComponent,
        TitleComponent,
        ActivityListComponent
      ],
    });

    expect(screen.getByTestId('home-component')).toBeInTheDocument();
  });

  it('should render create button when in teacher mode', async () => {
    modeServiceMock.getMode.mockReturnValue('teacher');

    await render(HomeComponent, {
      providers: [
        {provide: ActivityService, useValue: activityServiceMock},
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [
        ButtonComponent,
        TitleComponent,
        ActivityListComponent
      ],
    });

    // Aquí nos aseguramos de buscar por el texto visible
    expect(screen.getByText('Create activity')).toBeInTheDocument();
  });

  it('should call addActivity when "Create activity" button is clicked', async () => {
    modeServiceMock.getMode.mockReturnValue('teacher');

    await render(HomeComponent, {
      providers: [
        {provide: ActivityService, useValue: activityServiceMock},
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [
        ButtonComponent,
        TitleComponent,
        ActivityListComponent
      ],
    });

    await userEvent.click(screen.getByText('Create activity'));

    expect(activityServiceMock.addActivity).toHaveBeenCalled();
  });

  it('should open file input when "Import activity" button is clicked', async () => {
    modeServiceMock.getMode.mockReturnValue('student');

    const {fixture} = await render(HomeComponent, {
      providers: [
        {provide: ActivityService, useValue: activityServiceMock},
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [
        ButtonComponent,
        TitleComponent,
        ActivityListComponent
      ],
    });

    const fileInput = fixture.componentInstance.fileInput;
    jest.spyOn(fileInput.nativeElement, 'click');

    await userEvent.click(screen.getByText('Import activity'));

    expect(fileInput.nativeElement.click).toHaveBeenCalled();
  });

  it('should handle receiving deleteActivityEmitter from ActivityList', async () => {
    const {fixture} = await render(HomeComponent, {
      providers: [
        {provide: ActivityService, useValue: activityServiceMock},
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [
        ButtonComponent,
        TitleComponent,
        ActivityListComponent
      ],
    });

    const activityListDebugElement = fixture.debugElement.query(By.directive(ActivityListComponent));
    const activityListComponent = activityListDebugElement.componentInstance as ActivityListComponent;

    activityListComponent.deleteActivityEmitter.emit('1');
    fixture.detectChanges();

    expect(activityServiceMock.deleteActivity).toHaveBeenCalledWith('1');
  });

  it('should handle file selection and parsing', async () => {
    modeServiceMock.getMode.mockReturnValue('student');

    const file = new File([JSON.stringify({
      id: '1',
      title: 'Activity 1',
      dueDate: '03/03',
      workspace: '{}',
      toolboxDefinition: '{}',

    })], 'test.blearn', {type: 'application/json'});

    await render(HomeComponent, {
      providers: [
        {provide: ActivityService, useValue: activityServiceMock},
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [
        ButtonComponent,
        TitleComponent,
        ActivityListComponent
      ],
    });

    const input = screen.getByTestId('file-input');
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(activityServiceMock.addActivity).toHaveBeenCalled();
    });
  });
});
