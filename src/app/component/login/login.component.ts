import { Component } from '@angular/core';
import { LoginService } from '../../service/login/login.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
declare var particlesJS: any;

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [LoginService],
  imports: [RouterOutlet,FormsModule,CommonModule,RouterLink,RouterLinkActive, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private service: LoginService) {}
  username: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  isError: boolean = false;
  showUsernameError: boolean = false;
  showPasswordError: boolean = false;

  ngOnInit() {
    this.animateText("Rooms Reservation Login");

  }

  login() {
    if (this.username === '') {
      this.showUsernameError = true;
      return;
    }
    if (this.password === '') {
      this.showPasswordError = true;
      return;
    }

    this.service.login(this.username, this.password).subscribe((res: any)  => {
      if (res.status) {
        this.isLoggedIn = true;
        this.username = '';
        this.password = '';
        this.showUsernameError = false;
        this.showPasswordError = false;
        location.href='/dashboard'
      } else {
        this.isError = true;
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
    } else {
      console.error('Element with id "animated-text" not found.');
    }
  }
  validateUsername() {
    this.showUsernameError = this.username === '';
  }

  validatePassword() {
    this.showPasswordError = this.password === '';
  }

  clearErrors() {
    this.showUsernameError = false;
    this.showPasswordError = false;
    this.isError = false;
  }
}
