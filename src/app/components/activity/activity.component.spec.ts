import {ActivityService} from '../../services/activity.service';
import {Activity} from '../../models/activity';
import {render, screen} from '@testing-library/angular';
import {ActivityComponent} from './activity.component';
import {RouterModule} from '@angular/router';
import {userEvent} from '@testing-library/user-event';

describe('ActivityComponent', () => {
  let activityServiceMock: jest.Mocked<ActivityService>;

  beforeEach(() => {
    activityServiceMock = {
      downloadActivity: jest.fn(),
    } as unknown as jest.Mocked<ActivityService>;
  });

  const mockActivity: Activity = {
    id: '1',
    title: 'Activity 1',
    description: 'Description',
    dueDate: '03/03',
    workspace: '{}',
    toolboxInfo: {
      toolboxDefinition: '',
      BLOCK_LIMITS: {}
    }
  };

  it('should toggle the menu when clicking the button', async () => {
    // given
    await render(ActivityComponent, {
      inputs: {
        activity: mockActivity
      },
      providers: [{ provide: ActivityService, useValue: activityServiceMock }],
      imports: [RouterModule],
    });

    const menuButton = screen.getByTestId('menu-toggle');
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();

    // when
    await userEvent.click(menuButton);

    // then
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();

    await userEvent.click(menuButton);
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should close the menu when clicking outside it', async () => {
    // given
    await render(ActivityComponent, {
      inputs: {
        activity: mockActivity
      },
      providers: [{provide: ActivityService, useValue: activityServiceMock}],
      imports: [RouterModule],
    });

    const menuButton = screen.getByTestId('menu-toggle');
    await userEvent.click(menuButton);
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();

    // when
    await userEvent.click(document.body);

    // then
    expect(screen.queryByText('Download')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });

  it('should emit deleteActivityEmitter when clicking the "Delete" button and accepting', async () => {
    // given
    const { fixture } = await render(ActivityComponent, {
      inputs: {
        activity: mockActivity,
      },
      providers: [{provide: ActivityService, useValue: activityServiceMock}],
      imports: [RouterModule],
    });
    const componentInstance = fixture.componentInstance;
    const deleteSpy = jest.spyOn(componentInstance.deleteActivityEmitter, 'emit');

    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // when
    await userEvent.click(screen.getByTestId('menu-toggle'));
    await userEvent.click(screen.getByText('Delete'));

    // then
    expect(deleteSpy).toHaveBeenCalledWith(mockActivity.id);
  });

  it('should call downloadActivity when clicking "Download" button', async () => {
    // given
    await render(ActivityComponent, {
      inputs: {
        activity: mockActivity
      },
      providers: [{provide: ActivityService, useValue: activityServiceMock}],
      imports: [RouterModule],
    });

    await userEvent.click(screen.getByTestId('menu-toggle'));

    // when
    await userEvent.click(screen.getByText('Download'));

    // then
    expect(activityServiceMock.downloadActivity).toHaveBeenCalledWith(mockActivity);
  });
});
