import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-isesion',
  standalone:true,
  imports: [CommonModule, FormsModule, NgIf],
  templateUrl: './isesion.component.html',
  styleUrl: './isesion.component.css'
})
export class IsesionComponent {

  // Objeto que almacena las credenciales que el usuario ingresará en el formulario.
  // Se enlaza con ngModel en la plantilla.
  usuario = {
    email: '',
    password: ''
  };

  // Variable para mostrar mensajes de error en la vista.
  error: string = '';

  constructor(
    // Servicio encargado de manejar autenticación y comunicación con el backend.
    private authService: AuthService,

    // Router para redireccionar luego de iniciar sesión.
    private router: Router
  ) {}

  // Método llamado al enviar el formulario de inicio de sesión.
  iniciarSesion(): void {

    // Validación básica: ambos campos deben estar completos.
    if (!this.usuario.email || !this.usuario.password) {
      this.error = 'Por favor ingrese sus credenciales.';
      return;
    }

    // Llama al servicio de autenticación y espera la respuesta del backend.
    this.authService.login(this.usuario).subscribe({

      // Si la petición es exitosa:
next: (res) => {
  console.log("RESPONSE LOGIN:", res); // 👈 Muy importante
  this.error = '';
  alert('Inicio de sesión exitoso');
  this.router.navigate(['/productos']);
},


      // Si ocurre un error (credenciales incorrectas o fallo del servidor):
      error: (err) => {
        console.error('Error al iniciar sesión', err);

        // Mensaje destinado a mostrarse en la interfaz.
        this.error = 'Credenciales incorrectas o error en el servidor.';
      }
    });
  }

  

}

