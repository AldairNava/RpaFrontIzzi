import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable  } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkService {

  private isDarkMode = true;
  private darkModeSubject = new BehaviorSubject<boolean>(this.isDarkMode);

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeSubject.next(this.isDarkMode);
  }

  isDarkModeEnabled(): boolean {
    return this.isDarkMode;
  }

  // Observable para escuchar cambios en el modo oscuro
  darkModeChanges$(): Observable<boolean> {
    return this.darkModeSubject.asObservable();
  }
}
