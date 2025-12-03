import { Injectable, Inject, PLATFORM_ID, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost/api_proyecto/public/users';
  private isBrowser: boolean;

  // Evento original que ya tenías
  loginEvent = new EventEmitter<void>();

  // -----------------------------------------------------
  // Cambios mínimos para navbar reactivo
  // -----------------------------------------------------
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  private isAdminSubject = new BehaviorSubject<boolean>(this.esAdmin());

  // Observables públicos para el navbar
  isLoggedIn$ = this.loggedInSubject.asObservable();
  isAdmin$ = this.isAdminSubject.asObservable();
  // -----------------------------------------------------

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response?.token && this.isBrowser) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));

          // Emitir evento original
          this.loginEvent.emit();

          // Actualizar subjects para navbar
          this.loggedInSubject.next(true);
          this.isAdminSubject.next(this.esAdmin());
        }
      })
    );
  }

  // ---------------------------------------------------------
  // REGISTER
  // ---------------------------------------------------------
  register(usuario: { nombre: string; email: string; password: string; rol?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

  // ---------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }

    // Emitir evento original
    this.loginEvent.emit();

    // Actualizar subjects para navbar
    this.loggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  // ---------------------------------------------------------
  // TOKEN
  // ---------------------------------------------------------
  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  // ---------------------------------------------------------
  // OBTENER USUARIO
  // ---------------------------------------------------------
  getUsuario(): any {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem('usuario');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('JSON inválido en usuario, limpiando storage');
      localStorage.removeItem('usuario');
      return null;
    }
  }

  // ---------------------------------------------------------
  // LOGIN STATUS
  // ---------------------------------------------------------
  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('token');
  }

  // ---------------------------------------------------------
  // ADMIN CHECK
  // ---------------------------------------------------------
  esAdmin(): boolean {
    const usuario = this.getUsuario();
    if (!usuario) return false;

    if (usuario.rol) {
      return usuario.rol.toUpperCase() === 'ADMIN' || usuario.rol.toUpperCase() === 'ROLE_ADMIN';
    }

    if (usuario.roles && Array.isArray(usuario.roles)) {
      return usuario.roles.map((r: string) => r.toUpperCase()).includes('ADMIN') ||
             usuario.roles.map((r: string) => r.toUpperCase()).includes('ROLE_ADMIN');
    }

    return false;
  }
}
