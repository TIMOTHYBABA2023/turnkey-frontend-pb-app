import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkModeServiceService {
  private readonly DARK_MODE_KEY = 'darkMode';
  isDarkMode = false;

  constructor() {
    // Load dark mode preference from local storage
    const savedDarkMode = localStorage.getItem(this.DARK_MODE_KEY);
    this.isDarkMode = savedDarkMode === 'true';
    this.applyDarkMode();
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem(this.DARK_MODE_KEY, this.isDarkMode.toString());
    this.applyDarkMode();
  }

  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  
}
