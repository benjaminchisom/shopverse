import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sign-in',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
  email = '';
  password = '';
  message = '';
  isLoading = false;

  constructor(private auth: Auth) {}

  onSubmit() {
    this.message = '';
    this.isLoading = true;

    this.auth.signin({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        localStorage.setItem('accessToken', response.accessToken);
        this.message = 'Login successful! Welcome to ShopVerse.';
      },
      error: (error) => {
        this.isLoading = false;
        this.message =
          error.error?.message || 'Login failed. Please check your details.';
      },
    });
  }
}
