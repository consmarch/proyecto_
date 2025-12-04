import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { CarritoService} from '../../servicios/carrito.service';
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

  isLogged: boolean = false;
  isAdmin: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private carritoService: CarritoService,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    const carritoSub = this.carritoService.carrito$.subscribe(
      (items: DetalleCarrito[]) => {
        this.cantidadProductos = items.reduce((total, item) => total + item.cantidad, 0);
      }
    );

    const loginSub = this.auth.isLoggedIn$.subscribe(status => this.isLogged = status);
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
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
