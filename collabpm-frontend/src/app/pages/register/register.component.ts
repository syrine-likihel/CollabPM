import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  showPassword = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  get errors() {
    return {
      fullName: this.submitted && !this.fullName,
      email: this.submitted && (!this.email || !this.isValidEmail(this.email)),
      password: this.submitted && this.password.length < 6,
      confirmPassword: this.submitted && this.password !== this.confirmPassword,
    };
  }

  isFormValid(): boolean {
    return !!this.fullName &&
      !!this.email &&
      this.isValidEmail(this.email) &&
      this.password.length >= 6 &&
      this.password === this.confirmPassword;
  }

  onSubmit() {
    this.submitted = true;

    if (!this.isFormValid()) {
      this.alertService.error('Please fix the errors before submitting');
      return;
    }

    this.loading = true;

    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.alertService.success('Account created successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.alertService.error(err.userMessage || 'Registration failed');
      }
    });
  }
}