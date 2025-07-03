import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  mostrarError: boolean = false;

  constructor(private router: Router) {}

  iniciarSesion() {
    if (this.email.trim() && this.password.trim()) {
      this.mostrarError = false;
      this.router.navigate(['/home']);
    } else {
      this.mostrarError = true;
    }
  }
}
