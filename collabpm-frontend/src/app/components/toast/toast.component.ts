import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  constructor(public alertService: AlertService) {}
}