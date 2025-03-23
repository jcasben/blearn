import {ModeService} from '../../services/mode.service';
import {TitleComponent} from './title.component';
import {render, screen} from '@testing-library/angular';
import {NgClass} from '@angular/common';

describe('TitleComponent', () => {
  let modeServiceMock: jest.Mocked<ModeService>;

  beforeEach(() => {
    modeServiceMock = {
      setMode: jest.fn(),
      getMode: jest.fn()
    } as unknown as jest.Mocked<ModeService>;
  });

  it('should render student text when in student mode', async () => {
    // given
    modeServiceMock.getMode.mockReturnValue('student');
    await render(TitleComponent, {
      inputs: {
        studentText: 'Student',
        teacherText: 'Teacher',
        studentStyle: 'text-blue-500',
        teacherStyle: 'text-green-500'
      },
      providers: [{provide: ModeService, useValue: modeServiceMock}],
      imports: [NgClass],
    });

    // then
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Student')).toHaveClass('text-blue-500');
  });

  it('should render teacher text when in teacher mode', async () => {
    // given
    modeServiceMock.getMode.mockReturnValue('teacher');
    await render(TitleComponent, {
      inputs: {
        studentText: 'Student',
        teacherText: 'Teacher',
        studentStyle: 'text-blue-500',
        teacherStyle: 'text-green-500'
      },
      providers: [{provide: ModeService, useValue: modeServiceMock}],
      imports: [NgClass],
    });

    // then
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toHaveClass('text-green-500');
  });
})
