import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  // URL base que apunta directamente al archivo Routes.php del backend,
  // por eso no termina en "/compras", sino en "/public".
  private apiUrl = 'http://localhost/api_proyecto/public';

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------
  // FINALIZAR COMPRA
  // Envia los datos de la compra al backend (POST /compras/finalizar)
  // ---------------------------------------------------------
  finalizarCompra(data: any): Observable<any> {

    // Se envían los campos (dirección, teléfono, etc.)
    // junto con los headers de autenticación.
    return this.http.post(
      `${this.apiUrl}/compras/finalizar`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  // ---------------------------------------------------------
  // OBTENER HISTORIAL DE COMPRAS DEL USUARIO
  // GET /compras
  // ---------------------------------------------------------
  obtenerCompras(): Observable<any> {

    // Devuelve todas las compras del usuario autenticado.
    return this.http.get(
      `${this.apiUrl}/compras`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ---------------------------------------------------------
  // HEADERS DE AUTORIZACIÓN
  // Agrega el token al header Authorization.
  // ---------------------------------------------------------
  private getAuthHeaders(): HttpHeaders {

    // Obtiene token desde localStorage.
    const token = localStorage.getItem('token') || '';

    // Cabeceras necesarias para endpoints protegidos.
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
