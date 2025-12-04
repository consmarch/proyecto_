import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // URL base para todos los endpoints de productos.
  // Backend tiene rutas como:
  //   GET    /products
  //   POST   /products
  //   PUT    /products/:id
  //   DELETE /products/:id
  private apiUrl = 'http://localhost/api_proyecto/public/products';

  constructor(private http: HttpClient) {}

  // ============================================================
  // OBTENER TODOS LOS PRODUCTOS
  // GET /products
  // ============================================================
  obtenerProductos(): Observable<any[]> {
    // No requiere autenticación.
    return this.http.get<any[]>(this.apiUrl);
  }

  // ============================================================
  // CREAR PRODUCTO (solo admin)
  // POST /products
  // Se envía FormData porque incluye imágenes.
  // ============================================================
  crearProducto(formData: FormData): Observable<any> {
    return this.http.post(
      this.apiUrl,
      formData,
      {
        // Content-Type debe quedar vacío para que el navegador
        // genere el multipart/form-data automáticamente.
        headers: this.getAuthHeaders(false)
      }
    );
  }

  // ============================================================
  // ACTUALIZAR PRODUCTO (solo admin)
  // PUT /products/:id
  // Como Angular no manda PUT con FormData correctamente,
  // se usa técnica _method=PUT que el backend interpreta.
  // ============================================================
 actualizarProducto(id: number, formData: FormData): Observable<any> {
  formData.append("_method", "PUT");

  return this.http.post(`${this.apiUrl}/${id}`, formData, {
    headers: this.getAuthHeaders(false)
  });
}



  // ============================================================
  // ELIMINAR PRODUCTO (solo admin)
  // DELETE /products/:id
  // ============================================================
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // ============================================================
  // HEADERS DE AUTENTICACIÓN
  // Si json=true → se agrega Content-Type: application/json
  // Si json=false → se omite para enviar FormData
  // ============================================================
  private getAuthHeaders(json: boolean = true): HttpHeaders {
    const token = (typeof localStorage !== 'undefined')
      ? localStorage.getItem('token') || ''
      : '';

    // Siempre enviamos el token.
    const headers: any = { Authorization: `Bearer ${token}` };

    // Solo agregamos JSON cuando NO se envía FormData.
    if (json) {
      headers['Content-Type'] = 'application/json';
    }

    return new HttpHeaders(headers);
  }
}
