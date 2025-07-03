import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  mostrarError: boolean = false;

  constructor(private router: Router) {}

  registrar() {
    if (
      this.nombre.trim() &&
      this.email.trim() &&
      this.password.trim() &&
      this.confirmPassword.trim()
    ) {
      if (this.password === this.confirmPassword) {
        this.mostrarError = false;
        alert('Cuenta creada exitosamente.');
        this.router.navigate(['/login']);
      } else {
        alert('Las contraseñas no coinciden.');
      }
    } else {
      this.mostrarError = true;
    }
  }
}
