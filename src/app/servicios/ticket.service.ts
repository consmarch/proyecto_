import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = 'http://localhost/api_proyecto/public/api/tickets';

  constructor(private http: HttpClient) {}

  // ✔ Obtener ticket por ID de compra
  obtenerPorCompra(idCompra: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/compra/${idCompra}`);
  }

  // ✔ Descargar PDF del ticket
  descargar(numeroTicket: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/${numeroTicket}`, {
      responseType: 'blob'
    });
  }
}
