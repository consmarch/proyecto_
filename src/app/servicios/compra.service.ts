import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FinalizarCompraPayload {
  direccion: string;
  telefono: string;
  metodoPago: string;
  items: {
    id_detalle_carrito: number;
    producto_id: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
  }[];
}

export interface Compra {
  id: number;
  fecha: string;
  total: number;
  items: FinalizarCompraPayload['items'];
}

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private apiUrl = 'http://localhost/api_proyecto/public';

  constructor(private http: HttpClient) {}

  finalizarCompra(data: FinalizarCompraPayload): Observable<Compra> {
    return this.http.post<Compra>(
      `${this.apiUrl}/compras/finalizar`,
      data,
      { headers: this.getAuthHeaders() }
    );
  }

  obtenerCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(
      `${this.apiUrl}/compras`,
      { headers: this.getAuthHeaders() }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
}
