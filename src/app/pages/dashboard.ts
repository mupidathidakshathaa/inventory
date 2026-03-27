import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../services/api';
import { Chart, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="p-6 max-w-7xl mx-auto space-y-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Dashboard</h1>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="p-3 bg-indigo-100 rounded-lg text-indigo-600 flex items-center justify-center">
            <mat-icon class="text-[24px] w-[24px] h-[24px]">inventory_2</mat-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Products</p>
            <p class="text-2xl font-bold text-slate-900">{{ products.length }}</p>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="p-3 bg-amber-100 rounded-lg text-amber-600 flex items-center justify-center">
            <mat-icon class="text-[24px] w-[24px] h-[24px]">warning</mat-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Low Stock Alerts</p>
            <p class="text-2xl font-bold text-slate-900">{{ lowStockProducts.length }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="p-3 bg-emerald-100 rounded-lg text-emerald-600 flex items-center justify-center">
            <mat-icon class="text-[24px] w-[24px] h-[24px]">trending_up</mat-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Sales Records</p>
            <p class="text-2xl font-bold text-slate-900">{{ sales.length }}</p>
          </div>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div class="p-3 bg-blue-100 rounded-lg text-blue-600 flex items-center justify-center">
            <mat-icon class="text-[24px] w-[24px] h-[24px]">show_chart</mat-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">ML Predictions</p>
            <p class="text-2xl font-bold text-slate-900">{{ rfPredictions.length ? 'Ready' : 'Pending' }}</p>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">Demand Prediction (Random Forest)</h2>
          <canvas id="rfChart"></canvas>
        </div>
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">Deep Learning Prediction (LSTM)</h2>
          <canvas id="lstmChart"></canvas>
        </div>
      </div>

      <!-- Clustering & Alerts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">Product Clustering (K-Means)</h2>
          <canvas id="clusterChart"></canvas>
        </div>
        
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">Reorder Alerts</h2>
          @if (lowStockProducts.length === 0) {
            <p class="text-slate-500 italic">No products are currently low on stock.</p>
          } @else {
            <ul class="space-y-3">
              @for (product of lowStockProducts; track product.id) {
                <li class="flex items-center justify-between p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
                  <div class="flex items-center space-x-3">
                    <mat-icon class="text-[20px] w-[20px] h-[20px]">warning</mat-icon>
                    <span class="font-medium">{{ product.name }}</span>
                  </div>
                  <div class="text-sm">
                    Stock: <strong>{{ product.quantity }}</strong> / {{ product.threshold }}
                  </div>
                </li>
              }
            </ul>
          }
        </div>
      </div>
    </div>
  `
})
export class Dashboard implements OnInit {
  private api = inject(ApiService);

  products: any[] = [];
  sales: any[] = [];
  lowStockProducts: any[] = [];
  rfPredictions: any[] = [];
  lstmPredictions: any[] = [];
  clusters: any[] = [];

  rfChart: any;
  lstmChart: any;
  clusterChart: any;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getProducts().subscribe(res => {
      this.products = res;
      this.lowStockProducts = res.filter(p => p.quantity <= p.threshold);
      
      if (this.products.length >= 3) {
        this.api.clusterProducts().subscribe(clusters => {
          this.clusters = clusters;
          this.renderClusterChart();
        });
      }
    });

    this.api.getSales().subscribe(res => {
      this.sales = res;
      
      if (this.sales.length >= 10) {
        this.api.predictRF().subscribe(preds => {
          this.rfPredictions = preds;
          this.renderRFChart();
        });
      }

      if (this.sales.length >= 20) {
        this.api.predictLSTM().subscribe(preds => {
          this.lstmPredictions = preds;
          this.renderLSTMChart();
        });
      }
    });
  }

  renderRFChart() {
    if (typeof document === 'undefined') return;
    if (this.rfChart) this.rfChart.destroy();
    const ctx = document.getElementById('rfChart') as HTMLCanvasElement;
    if (!ctx) return;

    const historical = this.sales.slice(-30);
    
    this.rfChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...historical.map(s => s.date), ...this.rfPredictions.map(p => p.date)],
        datasets: [
          {
            label: 'Historical Sales',
            data: [...historical.map(s => s.sales), ...Array(this.rfPredictions.length).fill(null)],
            borderColor: '#6366f1',
            tension: 0.1
          },
          {
            label: 'Predicted Demand (RF)',
            data: [...Array(historical.length).fill(null), ...this.rfPredictions.map(p => p.predicted_sales)],
            borderColor: '#f59e0b',
            borderDash: [5, 5],
            tension: 0.1
          }
        ]
      }
    });
  }

  renderLSTMChart() {
    if (typeof document === 'undefined') return;
    if (this.lstmChart) this.lstmChart.destroy();
    const ctx = document.getElementById('lstmChart') as HTMLCanvasElement;
    if (!ctx) return;

    const historical = this.sales.slice(-30);
    
    this.lstmChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [...historical.map(s => s.date), ...this.lstmPredictions.map(p => p.date)],
        datasets: [
          {
            label: 'Historical Sales',
            data: [...historical.map(s => s.sales), ...Array(this.lstmPredictions.length).fill(null)],
            borderColor: '#6366f1',
            tension: 0.1
          },
          {
            label: 'Predicted Demand (LSTM)',
            data: [...Array(historical.length).fill(null), ...this.lstmPredictions.map(p => p.predicted_sales)],
            borderColor: '#10b981',
            borderDash: [5, 5],
            tension: 0.1
          }
        ]
      }
    });
  }

  renderClusterChart() {
    if (typeof document === 'undefined') return;
    if (this.clusterChart) this.clusterChart.destroy();
    const ctx = document.getElementById('clusterChart') as HTMLCanvasElement;
    if (!ctx) return;

    const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    
    const datasets = Array.from(new Set(this.clusters.map(c => c.cluster))).map(clusterId => {
      return {
        label: `Cluster ${clusterId}`,
        data: this.clusters.filter(c => c.cluster === clusterId).map(c => ({
          x: c.quantity,
          y: c.threshold,
          name: c.name
        })),
        backgroundColor: colors[clusterId % colors.length]
      };
    });

    this.clusterChart = new Chart(ctx, {
      type: 'scatter',
      data: { datasets },
      options: {
        scales: {
          x: { title: { display: true, text: 'Quantity' } },
          y: { title: { display: true, text: 'Threshold' } }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `${context.raw.name}: (${context.raw.x}, ${context.raw.y})`;
              }
            }
          }
        }
      }
    });
  }
}
