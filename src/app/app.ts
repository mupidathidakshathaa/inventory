import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterOutlet, RouterLink, RouterLinkActive, Router} from '@angular/router';
import {AuthService} from './services/auth';
import {MatIconModule} from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    @if (auth.isAuthenticated()) {
      <div class="min-h-screen bg-slate-50 flex">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div class="h-16 flex items-center px-6 border-b border-slate-200">
            <h1 class="text-xl font-bold text-slate-900">AI Inventory</h1>
          </div>
          
          <nav class="flex-1 px-4 py-6 space-y-1">
            <a routerLink="/" routerLinkActive="bg-indigo-50 text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <mat-icon class="text-[20px] w-[20px] h-[20px]">dashboard</mat-icon>
              <span class="font-medium">Dashboard</span>
            </a>
            
            <a routerLink="/inventory" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <mat-icon class="text-[20px] w-[20px] h-[20px]">inventory_2</mat-icon>
              <span class="font-medium">Inventory</span>
            </a>
            
            <a routerLink="/sales" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <mat-icon class="text-[20px] w-[20px] h-[20px]">trending_up</mat-icon>
              <span class="font-medium">Sales Data</span>
            </a>
            
            <a routerLink="/about" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <mat-icon class="text-[20px] w-[20px] h-[20px]">info</mat-icon>
              <span class="font-medium">About</span>
            </a>
            
            <a routerLink="/contact" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors">
              <mat-icon class="text-[20px] w-[20px] h-[20px]">contact_support</mat-icon>
              <span class="font-medium">Contact</span>
            </a>
          </nav>

          <div class="p-4 border-t border-slate-200">
            <div class="flex items-center justify-between px-3 py-2">
              <div class="text-sm font-medium text-slate-900 truncate">
                {{ auth.user()?.username }}
              </div>
              <button (click)="logout()" class="text-slate-500 hover:text-red-600 transition-colors" title="Logout">
                <mat-icon class="text-[20px] w-[20px] h-[20px]">logout</mat-icon>
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto">
          <router-outlet />
        </main>
      </div>
    } @else {
      <router-outlet />
    }
  `,
})
export class App {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
