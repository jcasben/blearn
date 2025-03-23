import {ModeService} from '../../services/mode.service';
import {render, screen} from '@testing-library/angular';
import {ButtonComponent} from './button.component';
import {NgClass} from '@angular/common';

describe('ButtonComponent', () => {
  let modeServiceMock: jest.Mocked<ModeService>;

  beforeEach(() => {
    modeServiceMock = {
      getMode: jest.fn(),
      setMode: jest.fn(),
    } as unknown as jest.Mocked<ModeService>;
  });

  it('should display student text when in student mode', async () => {
    // given
    modeServiceMock.getMode.mockReturnValue('student');
    await render(ButtonComponent, {
      inputs: {
        studentText: 'Student',
        teacherText: 'Teacher',
        studentStyle: 'text-blue-500',
        teacherStyle: 'text-green-500',
      },
      providers: [{ provide: ModeService, useValue: modeServiceMock }],
      imports: [NgClass],
    });

    // then
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Student')).toHaveClass('text-blue-500');
  });

  it('should display teacher text when in teacher mode', async () => {
    // given
    modeServiceMock.getMode.mockReturnValue('teacher');
    await render(ButtonComponent, {
      inputs: {
        studentText: 'Student',
        teacherText: 'Teacher',
        studentStyle: 'text-blue-500',
        teacherStyle: 'text-green-500',
      },
      providers: [{ provide: ModeService, useValue: modeServiceMock }],
      imports: [NgClass],
    });

    // then
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('Teacher')).toHaveClass('text-green-500');
  });
});
