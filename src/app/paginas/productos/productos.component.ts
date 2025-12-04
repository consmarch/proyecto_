import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../servicios/product.service';
import { CarritoService } from '../../servicios/carrito.service';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../modelos/producto.model';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  filteredProducts: Producto[] = [];

  // Filtros
  selectedCategory: string = '';
  selectedBrand: string = '';
  minPrecio: number | null = null;
  maxPrecio: number | null = null;

  categoria: string[] = [];
  nombre: string[] = [];

  cargando = true;
  error = '';

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
  ) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.obtenerProductos().subscribe({

      next: (res: Producto[]) => {
        this.productos = res;
        this.filteredProducts = res;

        res.forEach(producto => {
          console.log("IMAGEN:", producto.imagen);
          console.log("URL ARMADA:", 'http://localhost/api_proyecto/public/uploads/' + producto.imagen);
        });

        this.cargando = false;
      },


      error: (err: any) => {
        console.error('Error al cargar productos:', err);
        this.error = 'No se pudieron cargar los productos.';
        this.cargando = false;
      }

    });
  }


  filtrarProductos(): void {
    this.filteredProducts = this.productos.filter(p => {
      const porCategoria = this.selectedCategory ? p.categoria === this.selectedCategory : true;
      const porNombre = this.selectedBrand ? p.nombre === this.selectedBrand : true;
      const porMin = this.minPrecio !== null ? p.precio >= this.minPrecio : true;
      const porMax = this.maxPrecio !== null ? p.precio <= this.maxPrecio : true;

      return porCategoria && porNombre && porMin && porMax;
    });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.minPrecio = null;
    this.maxPrecio = null;

    this.filteredProducts = this.productos;
  }

  agregarAlCarrito(producto: Producto): void {
    this.carritoService.agregarAlCarrito(producto).subscribe({
      next: () => console.log('Producto agregado'),
      error: (err: any) => console.error(err)
    });
  }


}
