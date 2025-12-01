import { Component, OnInit } from '@angular/core';
import { Producto } from '../../modelos/producto.model';
import { CarritoService } from '../../servicios/carrito.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {

  productoEnCarrito: { producto: Producto; cantidad: number }[] = [];

  constructor(private carritoService: CarritoService, private router: Router) { }

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe((productos) => {
      this.productoEnCarrito = productos
    });
  }

  agregarCantidad(index: number) {
    this.productoEnCarrito[index].cantidad++;
  }

  quitarCantidad(index: number) {
    if (this.productoEnCarrito[index].cantidad > 1) {
      this.productoEnCarrito[index].cantidad--;
    }
  }

  eliminarProducto(productoId: number) {
    this.carritoService.eliminarDelCarrito(productoId)
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
  }

  realizarCompra() {
    alert('Compra realizada exitosamente!')
    this.vaciarCarrito();
  }

  irAFormularioCompra() {
    // Redirige al usuario a la ruta '/compra', donde se encuentra el formulario para finalizar la compra
    this.router.navigate(['/compra'])
  }

  // Calcula el total del carrito de compras
  calcularTotal(): number {
    // Recorre el arreglo de productos en el carrito y suma el resultado de (precio*cantidad) de cada item
    return this.productoEnCarrito.reduce((total, item) => {
      return total + item.producto.precio * item.cantidad
    }, 0)  // el acumulador 'total' comienza en 0
  }

}