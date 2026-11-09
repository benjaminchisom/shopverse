import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  constructor(
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  onSubmit() {
    this.message = '';
    this.isLoading = true;

    this.auth.signin({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.cdr.markForCheck();

        localStorage.setItem('accessToken', response.accessToken);

        this.router.navigate(['/account']);
      },
      error: (error) => {
        this.isLoading = false;
        this.cdr.markForCheck();

        this.message =
          error.error?.message || 'Login failed. Please check your details.';
      },
    });
  }
}
