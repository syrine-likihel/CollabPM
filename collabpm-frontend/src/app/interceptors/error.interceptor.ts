import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';

import { catchError, throwError } from 'rxjs';

import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);
  const authService = inject(AuthService);
  const alertService = inject(AlertService);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      let message = 'An unexpected error occurred';

      switch (error.status) {

        case 400:
          if (error.error?.errors) {
            message = formatValidationErrors(error.error);
          } else if (error.error?.message) {
            message = error.error.message;
          } else {
            message = 'Invalid request data';
          }
          break;

        case 401:
          message = 'Session expired. Please login again.';
          authService.logout();
          break;

        case 403:
          message = 'You do not have permission to perform this action';
          router.navigate(['/dashboard']);
          break;

        case 404:
          message = error.error?.message || 'Resource not found';
          break;

        case 500:
          message =
            error.error?.message ||
            'Server error. Please try again later.';
          break;

        case 0:
          message =
            'Cannot connect to server. Make sure the backend is running.';
          break;

        default:
          message =
            error.error?.message ||
            `Error ${error.status}`;
          break;
      }

      // Global error notification
      alertService.error(message);

      return throwError(() => ({
        ...error,
        userMessage: message
      }));
    })
  );
};

function formatValidationErrors(error: any): string {

  if (error?.errors) {
    const msgs = Object.values(error.errors)
      .map(message => String(message))
      .join(', ');

    return msgs;
  }

  return error?.message || 'Validation failed';
}