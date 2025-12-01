import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../servicios/carrito.service';
import { Producto } from '../../modelos/producto.model';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  terminoBusqueda: string = '';
  cantidadProductos: number = 0;

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {

    // Suscripción al carrito para actualizar la cantidad
    this.carritoService.carrito$.subscribe(
      (productos: { producto: Producto, cantidad: number }[]) => {
        this.cantidadProductos = productos.reduce(
          (total, item) => total + item.cantidad,
          0
        );
      }
    );

    // Suscripción al loginEvent para actualizar menú al iniciar sesión
    this.auth.loginEvent.subscribe(() => {
      // Los getters isLogged / isAdmin se actualizarán automáticamente
    });
  }

  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/productos'], { queryParams: { q: this.terminoBusqueda } });
    }
  }

  logout() {
    this.auth.logout();

    // Emitir evento para actualizar menú inmediatamente
    this.auth.loginEvent.emit();

    // Redirigir al inicio
    this.router.navigate(['/']);
  }

  // Getters para el HTML
  get isLogged(): boolean {
    return this.auth.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.auth.esAdmin();
  }
}
