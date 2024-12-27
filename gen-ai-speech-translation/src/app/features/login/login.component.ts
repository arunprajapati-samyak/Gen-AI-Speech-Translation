import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    public fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      userType: ['', [Validators.required]],
      lang: ['']
    })
  }


  onSubmit() {

  }
}
