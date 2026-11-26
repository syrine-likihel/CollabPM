import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  showPassword = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  get emailInvalid() {
    return this.submitted && (!this.email || !this.isValidEmail(this.email));
  }

  get passwordInvalid() {
    return this.submitted && !this.password;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  onSubmit() {
    this.submitted = true;

    if (!this.email || !this.isValidEmail(this.email)) {
      this.alertService.error('Please enter a valid email address');
      return;
    }
    if (!this.password) {
      this.alertService.error('Password is required');
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.alertService.success('Welcome back!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.alertService.error(err.userMessage || 'Invalid email or password');
      }
    });
  }
}