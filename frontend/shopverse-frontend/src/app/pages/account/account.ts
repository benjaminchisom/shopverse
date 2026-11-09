import {
  Component,
  ChangeDetectorRef,
  type OnInit,
  type OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import type { Subscription } from 'rxjs';
import { Auth, type AccountUser } from '../../services/auth';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit, OnDestroy {
  user: AccountUser | null = null;
  isLoading = false;
  errorMessage = '';

  private profileRequest?: Subscription;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.profileRequest?.unsubscribe();

    this.user = null;
    this.errorMessage = '';

    const token = localStorage.getItem('accessToken');

    if (!token) {
      this.signOut();
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    this.profileRequest = this.auth.me().subscribe({
      next: (response) => {
        this.user = response.user;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        this.user = null;
        this.isLoading = false;

        if (
          error instanceof HttpErrorResponse &&
          error.status === 401
        ) {
          this.signOut();
          return;
        }

        this.errorMessage =
          'Unable to load your account. Please try again.';

        this.cdr.markForCheck();
      },
    });
  }

  signOut(): void {
    this.profileRequest?.unsubscribe();
    this.profileRequest = undefined;

    localStorage.removeItem('accessToken');

    this.user = null;
    this.isLoading = false;
    this.errorMessage = '';

    this.cdr.markForCheck();

    this.router.navigate(['/sign-in'], {
      replaceUrl: true,
    });
  }

  ngOnDestroy(): void {
    this.profileRequest?.unsubscribe();
  }
}