import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

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
  cargando: boolean = false;
  mensajeError: string = '';


  constructor(private router: Router, private authService: AuthService) {}

  iniciarSesion() {
    if (this.email.trim() && this.password.trim()) {
      this.mostrarError = false;
      this.cargando = true;

      this.authService.login(this.email, this.password).subscribe({
        next: (res) => {
          this.cargando = false;
          // Guardar token, si lo hay, en localStorage/sessionStorage
          localStorage.setItem('token', res.token);
          // Redirigir a home o dashboard
          this.router.navigate(['/home']);
        },
        error: (err) => {
  this.cargando = false;
  this.mensajeError = err.error?.message || 'Error en el inicio de sesión.';
  this.mostrarError = true;
}
      })
    }
  }
}