import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})

export class ContactoComponent implements OnInit {

  // Declaración del formulario reactivo de contacto
  formularioContacto!: FormGroup;

  // Indicador para saber si el mensaje fue enviado
  mensajeEnviado = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Inicialización del formulario con validaciones
    this.formularioContacto = this.fb.group({
      nombre: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      mensaje: ['', Validators.required]
    });
  }

  // Método que se ejecuta al enviar el formulario
  enviarContacto(): void {
    if (this.formularioContacto.valid) {
      const datos = this.formularioContacto.value;

      // 👉 Acá podés enviar los datos a un servicio o backend
      console.log('📩 Datos del formulario de contacto:', datos);

      // Marca que el mensaje fue enviado
      this.mensajeEnviado = true;

      // Limpia el formulario después del envío
      this.formularioContacto.reset();
    } else {
      // Marca todos los campos como tocados para mostrar los errores
      this.formularioContacto.markAllAsTouched();
    }
  }
}
