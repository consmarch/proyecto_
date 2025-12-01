import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../servicios/ticket.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  // Objeto que contiene los datos del ticket (número, ruta, etc.)
  ticket: any = null;

  // ID de la compra recibido desde la URL
  idCompra!: number;

  // URL segura del PDF para mostrarlo en iframe/embed
  pdfUrl!: SafeResourceUrl;

  constructor(
    // Permite obtener parámetros de la ruta (id de la compra).
    private route: ActivatedRoute,

    // Servicio encargado de obtener tickets desde el backend.
    private ticketService: TicketService,

    // Necesario para permitir URLs de PDFs de manera segura en Angular.
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    // Obtiene el parámetro "id" de la URL.
    // Ejemplo: /ticket/15 → idCompra = 15
    this.idCompra = Number(this.route.snapshot.paramMap.get('id'));

    // Llama al backend para obtener datos del ticket asociados a la compra.
    this.ticketService.obtenerPorCompra(this.idCompra).subscribe({

      next: (ticket) => {
        this.ticket = ticket;

        // Construye manualmente la URL pública donde se guarda el PDF en el servidor.
        const url = `http://localhost/api_proyecto/public/tickets/ticket_${ticket.numero_ticket}.pdf`;

        // Angular bloquea URLs externas por seguridad, así que hay que "sanitizar" la URL
        // para usarla como src en un <iframe> o <embed>.
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },

      // Si no existe ticket para la compra, se deja en null para mostrar mensaje adecuado.
      error: () => {
        this.ticket = null;
      }
    });
  }

  // Método para descargar el PDF del ticket directamente desde el backend.
  descargarPDF(): void {

    // Si no hay ticket cargado, no se puede descargar.
    if (!this.ticket) return;

    // Llama al backend, que envía el PDF como Blob.
    this.ticketService.descargar(this.ticket.numero_ticket).subscribe(blob => {

      // Crea una URL temporal en memoria para abrir el PDF.
      const url = window.URL.createObjectURL(blob);

      // Abre el PDF en una nueva pestaña del navegador.
      window.open(url, '_blank');
    });
  }
}
