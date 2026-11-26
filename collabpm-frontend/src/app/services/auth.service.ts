import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = 'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
            id: response.id,
          fullName: response.fullName,
          email: response.email,
          role: response.role
        }));
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/register`, data).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
            id: response.id,
          fullName: response.fullName,
          email: response.email,
          role: response.role
        }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string {
    return this.getUser()?.role || '';
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
isProjectManager(): boolean {
  return this.getUser()?.role === 'PROJECT_MANAGER';
}
  isManagerOrAdmin(): boolean {
    const role = this.getRole();
    return role === 'ADMIN' || role === 'PROJECT_MANAGER';
  }

  getFullName(): string {
    return this.getUser()?.fullName || 'User';
  }
}