import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Inventory Management</h1>
        <div class="flex space-x-4">
          <button (click)="exportCSV()" class="flex items-center space-x-2 bg-white text-slate-700 px-4 py-2 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
            <mat-icon class="text-[18px] w-[18px] h-[18px]">download</mat-icon>
            <span>Export CSV</span>
          </button>
          <button (click)="showForm = !showForm" class="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
            <mat-icon class="text-[18px] w-[18px] h-[18px]">add</mat-icon>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      @if (showForm) {
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">{{ editingId ? 'Edit Product' : 'Add New Product' }}</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
              <input formControlName="name" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
              <input formControlName="quantity" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Reorder Threshold</label>
              <input formControlName="threshold" type="number" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            </div>
            <div class="flex space-x-2">
              <button type="submit" [disabled]="form.invalid" class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                Save
              </button>
              <button type="button" (click)="cancelEdit()" class="flex-1 bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }

      <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Threshold</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            @for (product of products; track product.id) {
              <tr class="hover:bg-slate-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{{ product.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{{ product.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ product.quantity }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{{ product.threshold }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  @if (product.quantity <= product.threshold) {
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Low Stock
                    </span>
                  } @else {
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      In Stock
                    </span>
                  }
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button (click)="editProduct(product)" class="text-indigo-600 hover:text-indigo-900">
                    <mat-icon class="text-[18px] w-[18px] h-[18px]">edit</mat-icon>
                  </button>
                  <button (click)="deleteProduct(product.id)" class="text-red-600 hover:text-red-900">
                    <mat-icon class="text-[18px] w-[18px] h-[18px]">delete</mat-icon>
                  </button>
                </td>
              </tr>
            }
            @if (products.length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-8 text-center text-slate-500">
                  No products found. Add some products to get started.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class Inventory implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);

  products: any[] = [];
  showForm = false;
  editingId: number | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    threshold: [20, [Validators.required, Validators.min(0)]]
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.api.getProducts().subscribe(res => {
      this.products = res;
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const data = this.form.value;
    
    if (this.editingId) {
      this.api.updateProduct(this.editingId, data).subscribe(() => {
        this.loadProducts();
        this.cancelEdit();
      });
    } else {
      this.api.addProduct(data).subscribe(() => {
        this.loadProducts();
        this.cancelEdit();
      });
    }
  }

  editProduct(product: any) {
    this.editingId = product.id;
    this.form.patchValue({
      name: product.name,
      quantity: product.quantity,
      threshold: product.threshold
    });
    this.showForm = true;
  }

  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  cancelEdit() {
    this.showForm = false;
    this.editingId = null;
    this.form.reset({ quantity: 0, threshold: 20 });
  }

  exportCSV() {
    const headers = ['ID', 'Name', 'Quantity', 'Threshold'];
    const rows = this.products.map(p => [p.id, p.name, p.quantity, p.threshold]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventory_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
