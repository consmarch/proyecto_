import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../servicios/product.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // Lista de productos cargados desde el backend.
  productos: any[] = [];

  // Formulario reactivo donde se cargan los datos del producto.
  formulario!: FormGroup;

  // Indica si estamos editando un producto existente.
  editando = false;

  // Contiene los datos del producto que se está editando.
  productoActual: any = null;

  // Vista previa de la imagen antes de enviarla.
  imagenPrevia: string | null = null;

  // Archivo físico seleccionado para subir al servidor.
  archivoImagen: File | null = null;

  constructor(
    // Servicio que maneja las operaciones CRUD de productos.
    private productService: ProductService,

    // FormBuilder para simplificar la creación del formulario reactivo.
    private fb: FormBuilder
  ) {}

  // Se ejecuta al iniciar el componente.
  ngOnInit(): void {
    this.crearFormulario();   // Inicializa el formulario con validaciones.
    this.cargarProductos();   // Obtiene todos los productos del backend.
  }

  // Configura el formulario reactivo y sus campos.
  crearFormulario() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: [0, [Validators.required, Validators.min(1)]],
      stock: [0, Validators.required],
      imagen: [''] // Este campo solo se usa para mantener el archivo seleccionado.
    });
  }

  // Llama al backend para obtener la lista de productos.
  cargarProductos() {
    this.productService.obtenerProductos().subscribe({
      next: (res) => this.productos = res,
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  // Maneja el cambio de archivo cuando el usuario selecciona una imagen.
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return; // Si no se seleccionó nada, no hacemos nada.

    // Guardamos la imagen física para enviarla luego en FormData.
    this.archivoImagen = file;

    // Preparamos vista previa usando FileReader.
    const reader = new FileReader();
    reader.onload = () => (this.imagenPrevia = reader.result as string);
    reader.readAsDataURL(file);
  }

  // Guarda un producto: crea uno nuevo o actualiza uno existente según "editando".
  guardar() {

    // Armamos un FormData, obligatorio para enviar archivos.
    const formData = new FormData();
    formData.append("nombre", this.formulario.value.nombre);
    formData.append("descripcion", this.formulario.value.descripcion);
    formData.append("precio", this.formulario.value.precio);
    formData.append("stock", this.formulario.value.stock);

    // Solo enviamos la imagen si se seleccionó una nueva.
    if (this.archivoImagen) {
      formData.append("imagen", this.archivoImagen);
    }

    // EDICIÓN
    if (this.editando) {

      this.productService.actualizarProducto(this.productoActual.id, formData).subscribe({
        next: () => {
          alert("Producto actualizado");
          this.reset();           // Resetea los estados del formulario.
          this.cargarProductos(); // Refresca la lista.
        },
        error: (err) => console.error("Error actualizando producto", err)
      });

    } 
    // CREACIÓN
    else {

      this.productService.crearProducto(formData).subscribe({
        next: () => {
          alert("Producto creado");
          this.reset();
          this.cargarProductos();
        },
        error: () => alert("Error al crear producto")
      });
    }
  }

  // Cargar datos de un producto en el formulario para editarlo.
  editar(producto: any) {
    this.editando = true;
    this.productoActual = producto;

    // Cargar datos actuales al formulario.
    this.formulario.patchValue({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });

    // Arma la URL completa para mostrar la imagen previa.
    this.imagenPrevia = producto.imagen
      ? `http://localhost/api_proyecto/public/uploads/${producto.imagen}`
      : null;
  }

  // Elimina un producto del backend.
  eliminar(id: number) {
    if (!confirm("¿Seguro de eliminar este producto?")) return;

    this.productService.eliminarProducto(id).subscribe({
      next: () => {
        alert("Producto eliminado");
        this.cargarProductos();
      },
      error: () => alert("Error eliminando producto")
    });
  }

  // Resetea el formulario y vuelve al estado inicial.
  reset() {
    this.formulario.reset();
    this.editando = false;
    this.productoActual = null;
    this.imagenPrevia = null;
    this.archivoImagen = null;
  }
}
