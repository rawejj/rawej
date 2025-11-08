import { render, screen } from '@testing-library/react';
import { LocalizationProvider, useLocalization, languages } from './LocalizationProvider';
import { fireEvent } from '@testing-library/react';

describe('LocalizationProvider', () => {
  function TestComponent() {
    const { language, config, setLanguage } = useLocalization();
    return (
      <div>
        <span data-testid="lang">{language}</span>
        <span data-testid="dir">{config.direction}</span>
        <span data-testid="dateFormat">{config.dateFormat}</span>
        <span data-testid="timezone">{config.timezone}</span>
        <button onClick={() => setLanguage('fa')}>Switch to Persian</button>
      </div>
    );
  }

  it('provides default English config', () => {
    render(
      <LocalizationProvider>
        <TestComponent />
      </LocalizationProvider>
    );
    expect(screen.getByTestId('lang').textContent).toBe('en');
    expect(screen.getByTestId('dir').textContent).toBe('ltr');
    expect(screen.getByTestId('dateFormat').textContent).toBe(languages.en.dateFormat);
    expect(screen.getByTestId('timezone').textContent).toBe(languages.en.timezone);
  });

  it('switches to Persian and updates config', () => {
    render(
      <LocalizationProvider>
        <TestComponent />
      </LocalizationProvider>
    );
    fireEvent.click(screen.getByText('Switch to Persian'));
    expect(screen.getByTestId('lang').textContent).toBe('fa');
    expect(screen.getByTestId('dir').textContent).toBe('rtl');
    expect(screen.getByTestId('dateFormat').textContent).toBe(languages.fa.dateFormat);
    expect(screen.getByTestId('timezone').textContent).toBe(languages.fa.timezone);
  });
});
