import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should toggle theme from dark to light', () => {
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('light-theme');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light-theme');
  });

  it('should toggle theme from light to dark', () => {
    service.toggleTheme(); // First toggle to light
    service.toggleTheme(); // Second toggle back to dark
    expect(service.getCurrentTheme()).toBe('dark-theme');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark-theme');
  });

  it('should return the current theme as dark-theme initially', () => {
    expect(service.getCurrentTheme()).toBe('dark-theme');
  });

  it('should return the current theme as light-theme after toggling', () => {
    service.toggleTheme();
    expect(service.getCurrentTheme()).toBe('light-theme');
  });
});