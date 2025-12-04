import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  // URL base donde están las rutas principales del backend.
  private apiUrl = 'http://localhost/api_proyecto/public';

  constructor(private http: HttpClient) {}

  // ---------------------------------------------------------
  // HEADERS DE AUTORIZACIÓN
  // Se usa para operaciones protegidas (obtener ticket por compra).
  // ---------------------------------------------------------
  private getHeaders() {
    const token = localStorage.getItem('token') || '';

    // No se manda Content-Type porque es una petición GET.
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ---------------------------------------------------------
  // OBTENER TICKET POR ID DE COMPRA
  // GET /ticket/compra/:idCompra
  // El backend devuelve:
  // { id_ticket, id_compra, numero_ticket, pdf_ruta }
  // ---------------------------------------------------------
  obtenerPorCompra(idCompra: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/ticket/compra/${idCompra}`,
      this.getHeaders()
    );
  }

  // ---------------------------------------------------------
  // DESCARGAR PDF DEL TICKET
  // GET /ticket/:numeroTicket
  // Se recibe el archivo en formato Blob.
  // No requiere token porque los PDFs son públicos.
  // ---------------------------------------------------------
  descargar(numeroTicket: string): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/ticket/${numeroTicket}`,
      {
        // Indicamos que queremos el PDF como binary Blob.
        responseType: 'blob'
      }
    );
  }
}
