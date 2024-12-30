import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkMode.asObservable();

  toggleDarkMode() {
    this.darkMode.next(!this.darkMode.value);
  }

  private collapsedSideBar = new BehaviorSubject<boolean>(false);
  public collapsedSideBar$ = this.collapsedSideBar.asObservable();

  togglecollapsedSideBar() {
    this.collapsedSideBar.next(!this.collapsedSideBar.value);
  }
}
