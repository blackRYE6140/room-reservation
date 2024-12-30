import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from './service/theme/theme.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterOutlet, RouterLink, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  collapsed = true;
  collapsedSideBar: boolean =  true ;
  darkMode = false;

  constructor(private themeService: ThemeService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.collapsedSideBar = this.router.url.includes('/login');
      }
    });
  
  }
  

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  togglecollapsedSideBar() {
    this.themeService.togglecollapsedSideBar();
  }

  ngOnInit() {
    if(this.collapsed){
      this.animateText("ROOMS RESERVATIONS");
    }
    this.themeService.darkMode$.subscribe(mode => {
      this.darkMode = mode;
    });

    this.router.events.subscribe((event) => {
      if (this.router.url.includes('/reservation')) {
        this.collapsed = false;
      }
    });
  
  }

  animateText(text: string): void {
    const letters = text.split('');
    let animatedText = '';
    const element = document.getElementById('animated-text');
    if (element) {
      for (let i = 0; i < letters.length; i++) {
        setTimeout(() => {
          animatedText += letters[i];
          element.textContent = animatedText;
        }, i * 100);
      }
    }
  }
}
