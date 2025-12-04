import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Producto } from '../modelos/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiURL = "http://localhost/api_proyecto/public/products";

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiURL, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiURL}/${id}`, {
      headers: this.getHeaders()
    }).pipe(catchError(this.handleError));
  }

  crearProducto(formdata: FormData): Observable<any> {
    return this.http.post(this.apiURL, formdata, {
      headers: this.getHeaders().delete('Content-Type')
    }).pipe(catchError(this.handleError));
  }

actualizarProducto(id: number, formdata: FormData): Observable<any> {
  return this.http.put(`${this.apiURL}/${id}`, formdata, {
    headers: this.getHeaders().delete('Content-Type')
  }).pipe(catchError(this.handleError));
}

eliminarProducto(id: number): Observable<any> {
  return this.http.delete(`${this.apiURL}/${id}`, {
    headers: this.getHeaders()
  }).pipe(catchError(this.handleError));
}


  private handleError(error: any) {
    console.error('Error en ProductService:', error);

    let msg = 'Ocurrió un error al procesar la solicitud.';
    if (error?.error?.message) {
      msg = error.error.message;
    }
    return throwError(() => new Error(msg));
  }
}
