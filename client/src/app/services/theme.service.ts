import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = true;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const theme = this.isDarkMode ? 'dark-theme' : 'light-theme';
    document.documentElement.setAttribute('data-theme', theme);
  }

  getCurrentTheme() {
    return this.isDarkMode ? 'dark-theme' : 'light-theme';
  }
}
