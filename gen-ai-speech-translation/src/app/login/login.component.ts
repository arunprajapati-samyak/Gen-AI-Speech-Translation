import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';

import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    ReactiveFormsModule,
    MatRadioModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginMasterForm: FormGroup;
  roles: string[] = ["Speaker", "Host"];
  selectedLanguage: string = 'en';

  constructor(private fb: FormBuilder) {
    // Initialize the form with controls
    this.loginMasterForm = this.fb.group({
      username: ['', Validators.required],
      role: ['Listener', [Validators.required]],
      lang: ['en-US', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    debugger
    if (this.loginMasterForm.valid) {
      const username = this.loginMasterForm.get('username')?.value;
      const role = this.loginMasterForm.get('role')?.value;
      const lang = this.loginMasterForm.get('lang')?.value;

      sessionStorage.setItem('username', username);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('lang', lang);

      console.log('Username:', username);
      console.log('Role:', role);
      console.log('lang:', lang);
    }
  }
}