import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignalRService } from '../../services/signa-r.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  showLanguageDropdown = false;
  languages = [{ name: 'English', code: 'en-US' }, { name: 'Hindi', code: 'hi-IN' }, { name: 'Gujarati', code: 'gu-IN' }];

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private signalRService: SignalRService
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      userType: ['', [Validators.required]],
      lang: ['en-US']
    })
  }

  onUserTypeChange(userType: string): void {
    if (userType === 'Receiver') {
      this.showLanguageDropdown = true;
      this.loginForm.get('lang')?.setValidators([Validators.required]); // Add required validator for language
    } else {
      this.showLanguageDropdown = false;
      this.loginForm.get('lang')?.clearValidators(); // Clear validators for language
    }
    this.loginForm.get('lang')?.updateValueAndValidity(); // Update validation status
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const userType = this.loginForm.get('userType')?.value;
      const userName = this.loginForm.get('userName')?.value;
      const userLang = this.loginForm.get('lang')?.value;

      if (userName) {
        this.signalRService.startConnection(userName, userType, userLang);
        //this.signalRService.login(userName);
        // this.loggedInUsers = this.signalRService.loggedInUsers;
      }
      if (userType === 'Host') {
        this.router.navigate(['/host']);
      } else if (userType === 'Receiver') {
        this.router.navigate(['/receiver']);
      } else {
        // Handle unexpected values
        console.error('Invalid user type selected');
      }
    } else {
      console.error('Form is invalid');
    }
  }

  onSubmit() {

  }
}
