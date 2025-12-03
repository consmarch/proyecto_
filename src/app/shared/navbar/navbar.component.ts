import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf,  } from '@angular/common';
import { Subscription } from 'rxjs';
import { CarritoService } from '../../servicios/carrito.service';
import { Producto } from '../../modelos/producto.model';
import { AuthService } from '../../servicios/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  terminoBusqueda: string = '';
  cantidadProductos: number = 0;

  // Variables para controlar visibilidad del menú
  isLogged: boolean = false;
  isAdmin: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {

    // Suscripción al carrito
    const carritoSub = this.carritoService.carrito$.subscribe(
      (productos: { producto: Producto, cantidad: number }[]) => {
        this.cantidadProductos = productos.reduce(
          (total, item) => total + item.cantidad,
          0
        );
      }
    );

    // Suscripción al estado de login
    const loginSub = this.auth.isLoggedIn$.subscribe(status => this.isLogged = status);

    // Suscripción al estado de admin
    const adminSub = this.auth.isAdmin$.subscribe(status => this.isAdmin = status);

    this.subscriptions.push(carritoSub, loginSub, adminSub);
  }

  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/productos'], { queryParams: { q: this.terminoBusqueda } });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones al salir del componente
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
