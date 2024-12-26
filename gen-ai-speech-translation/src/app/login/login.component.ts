import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username: string = '';
  role: string = 'speaker';

  onLogin(): void {
    sessionStorage.setItem('username', this.username);
    sessionStorage.setItem('role', this.role);

    console.log('Username:', this.username);
    console.log('Role:', this.role);
  }
}
