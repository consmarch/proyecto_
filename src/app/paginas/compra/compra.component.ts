import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService, DetalleCarrito } from '../../servicios/carrito.service';
import { CompraService, FinalizarCompraPayload } from '../../servicios/compra.service';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  productos: DetalleCarrito[] = [];
  datos = {
    direccion: '',
    telefono: '',
    metodoPago: 'efectivo' // Puedes cambiarlo según tu formulario
  };

  subtotal = 0;
  envio = 1000;
  total = 0;

  mensaje = '';
  cargando = false;

  constructor(
    private carritoService: CarritoService,
    private compraService: CompraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Suscribimos al carrito para obtener productos actuales
    this.carritoService.carrito$.subscribe((items: DetalleCarrito[]) => {
      this.productos = items;
      this.calcularTotales();
    });
  }

  calcularTotales(): void {
    this.subtotal = this.productos.reduce((acc, p) => acc + p.subtotal, 0);
    this.total = this.subtotal + this.envio;
  }

  finalizarCompra(): void {
    if (this.productos.length === 0) {
      this.mensaje = 'El carrito está vacío';
      return;
    }

    // Creamos el payload completo según FinalizarCompraPayload
    const payload: FinalizarCompraPayload = {
      direccion: this.datos.direccion,
      telefono: this.datos.telefono,
      metodoPago: this.datos.metodoPago,
      items: this.productos
    };

    this.cargando = true;

    this.compraService.finalizarCompra(payload).subscribe({
      next: (res: any) => {
        this.mensaje = 'Compra realizada con éxito';
        // Limpiamos carrito local
        this.carritoService.vaciarCarrito();

        // Redirigimos al ticket después de un segundo
        setTimeout(() => this.router.navigate(['/ticket', res.id_compra || res.id]), 1000);
      },
      error: (err: any) => {
        console.error(err);
        this.mensaje = 'Error al procesar compra.';
        this.cargando = false;
      }
    });
  }
}
