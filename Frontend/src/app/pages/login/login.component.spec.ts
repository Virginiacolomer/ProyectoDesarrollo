import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  iniciarSesion() {
    if (this.email.trim() && this.password.trim()) {
      this.router.navigate(['/home']);
    } else {
      alert('Por favor, completá el email y la contraseña.');
    }
  }
}
