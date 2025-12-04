import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  carrito: any[] = [];
  envio: number = 1500;
  total: number = 0;

  constructor(
    public carritoService: CarritoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  // Carga los productos del BehaviorSubject
  cargarCarrito(): void {
    this.carrito = this.carritoService.obtenerProductos();
    this.calcularTotal();
  }

  // Calcula el total del carrito
  calcularTotal(): void {
    this.total = this.carrito.reduce(
      (sum, item) => sum + Number(item.producto.precio) * item.cantidad,
      0
    );
  }

  // Cambia la cantidad de un producto a un valor específico
  cambiarCantidad(productoId: number, nuevaCantidad: number): void {
    this.carritoService.actualizarCantidad(productoId, nuevaCantidad);
    this.cargarCarrito();
  }

  // Aumenta la cantidad de un producto
  agregarCantidad(index: number): void {
    const item = this.carrito[index];
    if (item) {
      this.carritoService.actualizarCantidad(item.producto.id, item.cantidad + 1);
      this.cargarCarrito();
    }
  }

  // Disminuye la cantidad de un producto
  restarCantidad(index: number): void {
    const item = this.carrito[index];
    if (item && item.cantidad > 1) {
      this.carritoService.actualizarCantidad(item.producto.id, item.cantidad - 1);
      this.cargarCarrito();
    }
  }

  // Elimina un producto del carrito
  eliminarProducto(productoId: number): void {
    this.carritoService.eliminarDelCarrito(productoId);
    this.cargarCarrito();
  }

  // Vacía todo el carrito
  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
    this.carrito = [];
    this.total = 0;
  }

  // Navega a la página de compra
  irACompra(): void {
    this.router.navigate(['/compra']);
  }
}
