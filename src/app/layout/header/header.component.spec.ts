import {ModeService} from '../../services/mode.service';
import {render, screen} from '@testing-library/angular';
import {HeaderComponent} from './header.component';
import {ButtonComponent} from '../../components/button/button.component';
import {TitleComponent} from '../../components/title/title.component';
import {userEvent} from '@testing-library/user-event';

describe('HeaderComponent', () => {
  let modeServiceMock: jest.Mocked<ModeService>;

  beforeEach(() => {
    modeServiceMock = {
      setMode: jest.fn(),
      getMode: jest.fn()
    } as unknown as jest.Mocked<ModeService>;
  });

  it('should render the component', async () => {
    // given
    await render(HeaderComponent, {
      providers: [
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [ButtonComponent, TitleComponent]
    });

    // when
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('should call switchMode when button is clicked and user confirms', async () => {
    // given
    jest.spyOn(window, 'confirm').mockReturnValue(true);
    modeServiceMock.getMode.mockReturnValue('student');
    await render(HeaderComponent, {
      providers: [
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [ButtonComponent, TitleComponent]
    });

    // when
    await userEvent.click(screen.getByTestId('button'));

    // then
    expect(modeServiceMock.setMode).toHaveBeenCalledWith('teacher');
  });

  it('should not call switchMode when button is clicked and user confirms', async () => {
    // given
    jest.spyOn(window, 'confirm').mockReturnValue(false);
    modeServiceMock.getMode.mockReturnValue('student');
    await render(HeaderComponent, {
      providers: [
        {provide: ModeService, useValue: modeServiceMock},
      ],
      imports: [ButtonComponent, TitleComponent]
    });

    // when
    await userEvent.click(screen.getByTestId('button'));

    // then
    expect(modeServiceMock.setMode).not.toHaveBeenCalled();
  });
});
