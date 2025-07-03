import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  mostrarError: boolean = false;
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  registrar() {
    if (
      this.name.trim() &&
      this.email.trim() &&
      this.password.trim() &&
      this.confirmPassword.trim()
    ) {
      if (this.password === this.confirmPassword) {
        this.mostrarError = false;
        this.cargando = true;

        this.authService.register({
          name: this.name,
          email: this.email,
          password: this.password,
        }).subscribe({
          next: () => {
            this.cargando = false;
            alert('Cuenta creada exitosamente.');
            this.router.navigate(['/login']);
          },
          error: (err) => {
            this.cargando = false;
            this.mensajeError = err.error?.message || 'Error al crear la cuenta.';
            this.mostrarError = true;
          }
        });

      } else {
        this.mensajeError = 'Las contraseñas no coinciden.';
        this.mostrarError = true;
      }
    } else {
      this.mensajeError = 'Por favor, completá todos los campos.';
      this.mostrarError = true;
    }
    
  }
}