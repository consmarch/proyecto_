import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(
    // Servicio de autenticación para verificar token, usuario y rol.
    private authService: AuthService,

    // Router para redirigir si el usuario no tiene permisos.
    private router: Router
  ) {}

  // Método que Angular ejecuta antes de permitir el acceso a una ruta protegida.
  canActivate(): boolean {

    // Verifica primero si el usuario tiene sesión activa
    // y luego si su rol es 'admin'.
    if (this.authService.isLoggedIn() && this.authService.esAdmin()) {
      return true; // Permite el acceso a la ruta.
    }

    // Si no está logueado o no es admin,
    // lo redirige a la pantalla de inicio de sesión.
    this.router.navigate(['/inicio-sesion']);

    return false; // Bloquea el acceso a la ruta protegida.
  }
}
