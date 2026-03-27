import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Sales Data</h1>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Upload Sales Data (CSV)</h2>
        <div class="flex items-center space-x-4">
          <input type="file" (change)="onFileSelected($event)" accept=".csv" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
          <button (click)="uploadFile()" [disabled]="!selectedFile || uploading" class="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors whitespace-nowrap">
            <mat-icon class="text-[18px] w-[18px] h-[18px]">upload</mat-icon>
            <span>{{ uploading ? 'Uploading...' : 'Upload' }}</span>
          </button>
        </div>
        @if (uploadMessage) {
          <p class="mt-3 text-sm" [class.text-green-600]="!uploadError" [class.text-red-600]="uploadError">{{ uploadMessage }}</p>
        }
        <div class="mt-4 text-sm text-slate-500">
          <p>CSV format required:</p>
          <code class="bg-slate-100 px-2 py-1 rounded mt-1 inline-block">Date,Sales,ProductID</code>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sales</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product ID</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            @for (sale of sales; track sale.id) {
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{{ sale.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{{ sale.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{{ sale.sales }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ sale.product_id || 'N/A' }}</td>
              </tr>
            }
            @if (sales.length === 0) {
              <tr>
                <td colspan="4" class="px-6 py-8 text-center text-slate-500">
                  No sales data found. Upload a CSV file to begin.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class Sales implements OnInit {
  private api = inject(ApiService);

  sales: any[] = [];
  selectedFile: File | null = null;
  uploading = false;
  uploadMessage = '';
  uploadError = false;

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.api.getSales().subscribe(res => {
      this.sales = res;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadMessage = '';
  }

  uploadFile() {
    if (!this.selectedFile) return;

    this.uploading = true;
    this.uploadMessage = '';
    this.uploadError = false;

    this.api.uploadSales(this.selectedFile).subscribe({
      next: (res) => {
        this.uploadMessage = res.message;
        this.uploading = false;
        this.selectedFile = null;
        this.loadSales();
      },
      error: (err) => {
        this.uploadError = true;
        this.uploadMessage = err.error?.error || 'Upload failed';
        this.uploading = false;
      }
    });
  }
}
