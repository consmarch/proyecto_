import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/carrito.service';
import { CompraService } from '../../servicios/compra.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  productos: any[] = [];
  datos = { direccion: '', telefono: '' };
  subtotal = 0;
  envio = 1000;
  total = 0;
  mensaje = '';
  cargando = false;

  constructor(
    private carritoService: CarritoService,
    private compraService: CompraService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carritoService.carrito$.subscribe(items => {
      this.productos = items;
      this.calcularTotales();
    });
  }

  calcularTotales() {
    this.subtotal = this.productos.reduce((acc, p) => {
      const precio = Number(p.precio_unitario) || 0;
      const cantidad = Number(p.cantidad) || 1;
      return acc + precio * cantidad;
    }, 0);

    this.total = this.subtotal + this.envio;
  }

  finalizarCompra() {

    if (this.productos.length === 0) {
      this.mensaje = 'El carrito está vacío';
      return;
    }

    const data = {
      direccion: this.datos.direccion,
      telefono: this.datos.telefono
    };

    this.cargando = true;

    this.compraService.finalizarCompra(data).subscribe({
      next: res => {
        console.log('RESPUESTA COMPLETA DEL BACKEND:', res);
        console.log('Keys del objeto:', Object.keys(res));
        console.log('JSON completo:', JSON.stringify(res)); 
        this.mensaje = 'Compra realizada con éxito';

        // Vaciar carrito primero, luego navegar al ticket
        this.carritoService.vaciarCarrito().subscribe({
          next: () => {
            if (res.id_compra) {
              this.router.navigate(['/ticket', res.id_compra]);
            } else {
              console.error('No se recibió id_compra del backend');
              this.mensaje = 'Compra realizada, pero no se pudo obtener el ticket.';
            }
          },
          error: err => {
            console.error('Error al vaciar carrito', err);
            // Aun así navegamos al ticket si existe
            if (res.id_compra) {
              this.router.navigate(['/ticket', res.id_compra]);
            }
          }
        });
      },
      error: err => {
        console.error('Error al procesar compra', err);
        this.mensaje = 'Error al procesar compra.';
        this.cargando = false;
      }
    });
  }
}
