import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  fullName = '';
  email = '';
  password = '';
  gender = '';
  message = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  onSubmit() {
    this.message = '';
    this.isLoading = true;

    this.auth.signup({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      gender: this.gender,
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/sign-in']);
      },
      error: (error) => {
        this.isLoading = false;
        this.message = error.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
