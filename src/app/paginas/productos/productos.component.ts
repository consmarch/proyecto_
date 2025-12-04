import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Producto } from '../../modelos/producto.model';
import { CarritoService } from '../../servicios/carrito.service';
import { ProductService } from '../../servicios/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  @ViewChild('track', { static: false }) track!: ElementRef;

  productos: Producto[] = [];
  filteredProducts: Producto[] = [];

  cargando = true;
  error = '';

  categoria: string[] = [];
  nombre: string[] = [];
  tipos: any[] = [];

  selectedCategory = '';
  selectedBrand = '';
  minPrecio: number | null = null;
  maxPrecio: number | null = null;

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.obtenerProductos().subscribe({
      next: (res: Producto[]) => {
        this.productos = res;
        this.filteredProducts = res;

        this.categoria = Array.from(
          new Set<string>(res.map((p: Producto) => p.categoria))
        );

        this.nombre = Array.from(
          new Set<string>(res.map((p: Producto) => p.nombre))
        );

        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error:', err);
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }
    });
  }

  filtrarProductos(): void {
    this.filteredProducts = this.productos.filter(prod => {
      return (
        (this.selectedCategory === '' || prod.categoria === this.selectedCategory) &&
        (this.selectedBrand === '' || prod.nombre === this.selectedBrand) &&
        (this.minPrecio === null || prod.precio >= this.minPrecio) &&
        (this.maxPrecio === null || prod.precio <= this.maxPrecio)
      );
    });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.minPrecio = null;
    this.maxPrecio = null;

    this.filteredProducts = [...this.productos];
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto);
    console.log('Producto agregado al carrito');
  }

  // ===============================
  // Métodos para el slider
  // ===============================

  scrollLeft(): void {
    if (this.track) {
      this.track.nativeElement.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  }

  scrollRight(): void {
    if (this.track) {
      this.track.nativeElement.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  }
}
