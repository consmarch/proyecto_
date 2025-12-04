import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  // Arreglo donde se almacenan los productos del carrito recibidos desde el backend.
  carrito: any[] = [];

  // Costo fijo de envío (puede parametrizarse más adelante).
  envio: number = 1500;

  // Total acumulado del carrito (se recalcula cada vez que cambian los items).
  total: number = 0;

  constructor(
    // Servicio que maneja todas las peticiones relacionadas al carrito.
    public carritoService: CarritoService,

    // Router para navegar a la pantalla de compra.
    private router: Router
  ) {}

  // Método del ciclo de vida de Angular, se ejecuta al inicializar el componente.
  ngOnInit(): void {
    this.cargarCarrito(); // Carga los productos del carrito desde el backend.
  }

  // Solicita los ítems del carrito al backend y los actualiza en el componente.
  cargarCarrito(): void {
    this.carritoService.obtenerCarrito().subscribe({
      next: (items: any[]) => {
        // En caso de respuesta válida, guardamos los ítems o un array vacío.
        this.carrito = items || [];

        // Recalculamos el total del carrito.
        this.calcularTotal();
      },
      error: () => {
        // Si hubo un error, mostramos carrito vacío y total 0.
        this.carrito = [];
        this.total = 0;
      }
    });
  }

  // Calcula el total sumando los subtotales de todos los productos.
  calcularTotal(): void {
    this.total = this.carrito.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0
    );
  }

  // Cambia la cantidad de un ítem del carrito.
  // Ahora trabaja correctamente con id_detalle_carrito proveniente del backend.
  cambiarCantidad(idDetalleCarrito: number, event: any): void {
    const nuevaCantidad = Number(event.target.value);

    this.carritoService.actualizarCantidad(idDetalleCarrito, nuevaCantidad).subscribe({
      next: (res: any) => {
        // El backend puede devolver el carrito dentro de res.carrito.
        // Por compatibilidad, también aceptamos res directo.
        const items = res.carrito ?? res ?? [];

        this.carrito = items;
        this.calcularTotal();
      }
    });
  }

  // Elimina un ítem del carrito usando su id_detalle_carrito.
  eliminar(idDetalleCarrito: number): void {
    this.carritoService.eliminarProducto(idDetalleCarrito).subscribe({
      next: (res: any) => {
        // Igual manejo de compatibilidad con res o res.carrito.
        const items = res.carrito ?? res ?? [];

        this.carrito = items;
        this.calcularTotal();
      }
    });
  }

  // Vacía completamente el carrito.
  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito().subscribe({
      next: () => {
        // Resetea carrito y total al vaciarse.
        this.carrito = [];
        this.total = 0;
      }
    });
  }

  // Navega a la página de compra para finalizar el proceso.
  irACompra(): void {
    this.router.navigate(['/compra']);
  }
}
