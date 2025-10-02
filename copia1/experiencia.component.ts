import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RangoNivel {
  nivelInicio: number;
  nivelFin: number;
  casillas: number;
  experiencia: number;
  itemsPorFabricar: number;
}

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css'],
})
export class ExperienciaComponent {
  nivelActual = 1;
  nivelObjetivo = 10;
  expActual = 0;
  bonusXP = 0;
  xpFaltante = 0;

  resultados: { slots: number; cantidad: number | 'MAX' }[] = [];

  rangosNivel: RangoNivel[] = [
    { nivelInicio: 1, nivelFin: 10, casillas: 2, experiencia: 1911, itemsPorFabricar: 192 },
    { nivelInicio: 10, nivelFin: 20, casillas: 3, experiencia: 6186, itemsPorFabricar: 248 },
    { nivelInicio: 20, nivelFin: 30, casillas: 4, experiencia: 11145, itemsPorFabricar: 223 },
    { nivelInicio: 30, nivelFin: 40, casillas: 4, experiencia: 17399, itemsPorFabricar: 348 },
    { nivelInicio: 40, nivelFin: 50, casillas: 5, experiencia: 25850, itemsPorFabricar: 259 },
    { nivelInicio: 50, nivelFin: 60, casillas: 5, experiencia: 35821, itemsPorFabricar: 313 },
    { nivelInicio: 60, nivelFin: 70, casillas: 6, experiencia: 48726, itemsPorFabricar: 249 },
    { nivelInicio: 70, nivelFin: 80, casillas: 6, experiencia: 64845, itemsPorFabricar: 242 },
    { nivelInicio: 80, nivelFin: 90, casillas: 7, experiencia: 84684, itemsPorFabricar: 213 },
    { nivelInicio: 90, nivelFin: 100, casillas: 7, experiencia: 109282, itemsPorFabricar: 193 }
  ];

  calcularXP() {
    this.resultados = [];

    if (this.nivelObjetivo <= this.nivelActual || this.nivelObjetivo > 100) {
      this.xpFaltante = 0;
      return;
    }

    const rango = this.rangosNivel.find(r =>
      this.nivelActual >= r.nivelInicio && this.nivelObjetivo <= r.nivelFin
    );

    if (!rango) {
      this.xpFaltante = 0;
      return;
    }

    this.xpFaltante = rango.experiencia - this.expActual;
    if (this.xpFaltante < 0) this.xpFaltante = 0;

    for (let slots = 1; slots <= 8; slots++) {
      if (slots < rango.casillas) {
        this.resultados.push({ slots, cantidad: 'MAX' });
      } else {
        // Ahora la cantidad de fabricaciones = experiencia faltante / slots
        const items = Math.ceil(this.xpFaltante / slots);
        this.resultados.push({ slots, cantidad: items });
      }
    }
  }
}
