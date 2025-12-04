import { Routes } from '@angular/router';
import { InicioComponent } from './paginas/inicio/inicio.component';
import { ProductosComponent } from './paginas/productos/productos.component';
import { ContactoComponent } from './paginas/contacto/contacto.component';
import { CarritoComponent } from './paginas/carrito/carrito.component';
import { QuienessomosComponent } from './paginas/quienessomos/quienessomos.component';
import { CompraComponent } from './paginas/compra/compra.component';
import { DibujaComponent } from './paginas/dibuja/dibuja.component';
import { IsesionComponent } from './paginas/isesion/isesion.component';
import { RegistrarComponent } from './paginas/registrar/registrar.component';
import { AdminGuard } from './guards/admin.guards';
import { AdminComponent } from './paginas/admin/admin.component';
import { TicketComponent } from './paginas/ticket/ticket.component';


export const routes: Routes = [

{path: '', redirectTo: '/inicio', pathMatch: 'full'},

{path: 'inicio', component:InicioComponent},
{path: 'contacto', component:ContactoComponent},
{path: 'productos', component:ProductosComponent},
{path: 'carrito', component:CarritoComponent},
{path: 'quienessomos', component:QuienessomosComponent},
{path: 'compra' , component:CompraComponent},
{path: 'dibuja', component: DibujaComponent},
{path: 'isesion', component: IsesionComponent},
{path: 'registrar', component: RegistrarComponent},
{path: 'admin', component: AdminComponent},
{path: 'ticket/:id', component: TicketComponent}
];
