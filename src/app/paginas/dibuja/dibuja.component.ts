import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dibuja',
  templateUrl: './dibuja.component.html',
  styleUrls: ['./dibuja.component.css'],
  standalone: true,             // <--- componente standalone
  imports: [CommonModule, FormsModule]  // <--- ahora sí funcionan *ngIf y [(ngModel)]
})
export class DibujaComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  painting: boolean = false;
  selectedTool: string = 'brush';

  brushColor: string = '#000000';
  brushSize: number = 5;

  selectedShape: string = 'square';

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas(canvas);
    this.addEventListeners(canvas);
  }

  selectTool(tool: string) {
    this.selectedTool = tool;
  }

  private resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  private addEventListeners(canvas: HTMLCanvasElement) {
    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('mouseup', () => this.onMouseUp());
    canvas.addEventListener('mouseleave', () => this.onMouseUp());
  }

  private onMouseDown(e: MouseEvent) {
    if (this.selectedTool === 'brush') {
      this.painting = true;
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
    } else if (this.selectedTool === 'shape') {
      this.drawShape(e.offsetX, e.offsetY);
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (this.selectedTool === 'brush' && this.painting) {
      this.ctx.lineWidth = this.brushSize;
      this.ctx.lineCap = 'round';
      this.ctx.strokeStyle = this.brushColor;

      this.ctx.lineTo(e.offsetX, e.offsetY);
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY);
    }
  }

  private onMouseUp() {
    if (this.selectedTool === 'brush') {
      this.painting = false;
      this.ctx.beginPath();
    }
  }

  private drawShape(x: number, y: number) {
    const size = 50;
    this.ctx.fillStyle = this.brushColor;

    switch (this.selectedShape) {
      case 'square':
        this.ctx.fillRect(x - size / 2, y - size / 2, size, size);
        break;
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        break;
      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size / 2);
        this.ctx.lineTo(x - size / 2, y + size / 2);
        this.ctx.lineTo(x + size / 2, y + size / 2);
        this.ctx.closePath();
        this.ctx.fill();
        break;
    }
  }
}
