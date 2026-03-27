import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="p-6 max-w-4xl mx-auto space-y-6">
      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h1 class="text-3xl font-bold text-slate-900 mb-6">About the System</h1>
        
        <div class="prose prose-slate max-w-none">
          <p class="text-lg text-slate-700 mb-4">
            The <strong>AI-Based Inventory Management and Demand Prediction System</strong> is a comprehensive full-stack application designed to help businesses optimize their stock levels and forecast future sales using advanced machine learning techniques.
          </p>
          
          <h2 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Core Technologies</h2>
          <ul class="list-disc pl-6 space-y-2 text-slate-700">
            <li><strong>Frontend:</strong> Angular, Tailwind CSS, Chart.js</li>
            <li><strong>Backend:</strong> Node.js, Express, SQLite</li>
            <li><strong>Machine Learning:</strong> Random Forest (ml-random-forest), K-Means Clustering (ml-kmeans)</li>
            <li><strong>Deep Learning:</strong> Long Short-Term Memory Networks (TensorFlow.js)</li>
          </ul>

          <h2 class="text-xl font-semibold text-slate-900 mt-8 mb-4">Key Features</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h3 class="font-medium text-slate-900 mb-2">Demand Forecasting</h3>
              <p class="text-sm text-slate-600">Predicts future sales for the next 30 days using both Random Forest and LSTM models, providing a comparative analysis of traditional ML vs Deep Learning approaches.</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h3 class="font-medium text-slate-900 mb-2">Smart Clustering</h3>
              <p class="text-sm text-slate-600">Groups products into distinct categories based on sales velocity and inventory thresholds using K-Means clustering algorithms.</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h3 class="font-medium text-slate-900 mb-2">Automated Alerts</h3>
              <p class="text-sm text-slate-600">Continuously monitors stock levels against dynamic thresholds, automatically generating reorder alerts to prevent stockouts.</p>
            </div>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-100">
              <h3 class="font-medium text-slate-900 mb-2">Data Portability</h3>
              <p class="text-sm text-slate-600">Seamlessly import historical sales data via CSV and export current inventory states for use in external BI tools like Power BI.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class About {}
