import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto space-y-6">
      <div class="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <h1 class="text-3xl font-bold text-slate-900 mb-6">Contact Support</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p class="text-slate-600 mb-8">
              Need help with the AI Inventory System? Have questions about the machine learning models or need to report a bug? Fill out the form below and our support team will get back to you.
            </p>

            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <mat-icon class="text-[24px] w-[24px] h-[24px]">email</mat-icon>
                </div>
                <div>
                  <h3 class="font-medium text-slate-900">Email Us</h3>
                  <p class="text-slate-600 text-sm">support&#64;inventory.ai</p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <mat-icon class="text-[24px] w-[24px] h-[24px]">phone</mat-icon>
                </div>
                <div>
                  <h3 class="font-medium text-slate-900">Call Us</h3>
                  <p class="text-slate-600 text-sm">+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input formControlName="name" type="text" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input formControlName="email" type="email" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              </div>
              
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea formControlName="message" rows="4" class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>

              <button type="submit" [disabled]="contactForm.invalid" class="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                Send Message
              </button>
              
              @if (submitted) {
                <div class="p-3 bg-green-50 text-green-700 rounded-lg text-sm text-center">
                  Thank you! Your message has been sent successfully.
                </div>
              }
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Contact {
  submitted = false;
  
  contactForm;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.submitted = true;
      this.contactForm.reset();
      setTimeout(() => this.submitted = false, 5000);
    }
  }
}
