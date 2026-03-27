import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-50">
      <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h2 class="text-2xl font-semibold text-slate-900 mb-6 text-center">AI Inventory System</h2>
        
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input formControlName="username" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input formControlName="password" type="password" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          </div>

          @if (error) {
            <div class="text-red-500 text-sm">{{ error }}</div>
          }

          <button type="submit" [disabled]="form.invalid || loading" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
            {{ loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Register') }}
          </button>
        </form>

        <div class="mt-4 text-center">
          <button (click)="toggleMode()" class="text-sm text-indigo-600 hover:text-indigo-800">
            {{ isLogin ? 'Need an account? Register' : 'Already have an account? Sign In' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class Login {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);

  isLogin = true;
  loading = false;
  error = '';

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const request = this.isLogin 
      ? this.api.login(this.form.value)
      : this.api.register(this.form.value);

    request.subscribe({
      next: (res) => {
        if (this.isLogin) {
          this.auth.setAuth(res.token, res.user);
          this.router.navigate(['/']);
        } else {
          this.isLogin = true;
          this.error = 'Registration successful. Please login.';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'An error occurred';
        this.loading = false;
      }
    });
  }
}
