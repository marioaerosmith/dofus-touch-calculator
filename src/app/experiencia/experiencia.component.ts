import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TramoReceta {
  casillas: number;
  xpPorReceta: number;
  minNivel: number;
  maxNivel: number;
}

interface TramoAgrupado {
  rangoInicio: number;
  rangoFin: number;
  casillas: number;
  xpTramo: number;
  recetasNecesarias: number;
}

@Component({
  selector: 'app-experiencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css'],
})
export class ExperienciaComponent {
  // Tabla oficial de XP acumulada para niveles 1 a 100
  xpAcumuladaPorNivel: number[] = [
    0, 50, 140, 271, 441, 653, 905, 1199, 1543, 1911,
    2330, 2792, 3297, 3840, 4439, 5078, 5762, 6493, 7280, 8097,
    8980, 9898, 10875, 11903, 12985, 14122, 15315, 16564, 17873, 19242,
    20672, 22166, 23726, 25353, 27048, 28815, 30656, 32572, 34566, 36641,
    38800, 41044, 43378, 45804, 48325, 50946, 53669, 56498, 59437, 62491,
    65664, 68960, 72385, 75943, 79640, 83482, 87475, 91624, 95937, 100421,
    105082, 109930, 114971, 120215, 125671, 131348, 137256, 143407, 149811, 156481,
    163429, 170669, 178214, 186080, 194283, 202839, 211765, 221082, 230808, 240964,
    251574, 262660, 274248, 286364, 299037, 312297, 326175, 340705, 355924, 371870,
    388582, 406106, 424486, 443772, 464016, 485274, 507604, 531071, 555741, 581687
  ];

  nivelActual: number = 1;
  nivelObjetivo: number = 20;
  bonusXP: number = 0;

  xpFaltante: number = 0;

  rangosNivel: TramoAgrupado[] = [
    { rangoInicio: 1, rangoFin: 10, casillas: 2, xpTramo: 1911, recetasNecesarias: 0 },
    { rangoInicio: 10, rangoFin: 20, casillas: 3, xpTramo: 6186, recetasNecesarias: 0 },
    { rangoInicio: 20, rangoFin: 30, casillas: 4, xpTramo: 11145, recetasNecesarias: 0 },
    { rangoInicio: 30, rangoFin: 40, casillas: 4, xpTramo: 17399, recetasNecesarias: 0 },
    { rangoInicio: 40, rangoFin: 50, casillas: 5, xpTramo: 25850, recetasNecesarias: 0 },
    { rangoInicio: 50, rangoFin: 60, casillas: 5, xpTramo: 37930, recetasNecesarias: 0 },
    { rangoInicio: 60, rangoFin: 70, casillas: 6, xpTramo: 56060, recetasNecesarias: 0 },
    { rangoInicio: 70, rangoFin: 80, casillas: 6, xpTramo: 84483, recetasNecesarias: 0 },
    { rangoInicio: 80, rangoFin: 90, casillas: 7, xpTramo: 130906, recetasNecesarias: 0 },
    { rangoInicio: 90, rangoFin: 100, casillas: 7, xpTramo: 209817, recetasNecesarias: 0 },
  ];

  tramosRecetas: TramoReceta[] = [
    { casillas: 2, xpPorReceta: 10, minNivel: 1, maxNivel: 60 },
    { casillas: 3, xpPorReceta: 25, minNivel: 10, maxNivel: 80 },
    { casillas: 4, xpPorReceta: 50, minNivel: 20, maxNivel: 100 },
    { casillas: 5, xpPorReceta: 100, minNivel: 40, maxNivel: 100 },
    { casillas: 6, xpPorReceta: 250, minNivel: 60, maxNivel: 100 },
    { casillas: 7, xpPorReceta: 500, minNivel: 80, maxNivel: 100 },
  ];

  resultadosPorTramo: TramoAgrupado[] = [];

  resultadosResumenDinamic: {
    casillas: number;
    recetasNecesarias: number;
    rango: string;
  }[] = [];

  private obtenerXPIntermedia(nivel: number): number {
    if (nivel <= 1) return 0;
    if (nivel > this.xpAcumuladaPorNivel.length) return this.xpAcumuladaPorNivel[this.xpAcumuladaPorNivel.length - 1];
    const nivelEntero = Math.floor(nivel);
    return this.xpAcumuladaPorNivel[nivelEntero - 1];
  }

  private obtenerXPRango(inicio: number, fin: number): number {
    return this.obtenerXPIntermedia(fin) - this.obtenerXPIntermedia(inicio);
  }

  calcularXPCalcular() {
    if (this.nivelObjetivo <= this.nivelActual) {
      this.xpFaltante = 0;
      this.resultadosPorTramo = [];
      this.resultadosResumenDinamic = [];
      return;
    }

    const totalXP = this.obtenerXPRango(Math.floor(this.nivelActual), Math.floor(this.nivelObjetivo));
    const bonusFactor = 1 + this.bonusXP / 100;

    this.xpFaltante = Math.max(0, Math.round(totalXP));

    this.resultadosPorTramo = [];

    for (const rango of this.rangosNivel) {
      if (rango.rangoFin <= this.nivelActual) continue;
      if (rango.rangoInicio >= this.nivelObjetivo) break;

      const desde = Math.max(Math.floor(this.nivelActual), rango.rangoInicio);
      const hasta = Math.min(Math.floor(this.nivelObjetivo), rango.rangoFin);

      const xpEnTramo = this.obtenerXPRango(desde, hasta);
      const tramoReceta = this.tramosRecetas.find(tramo => tramo.casillas === rango.casillas);
      const xpPorReceta = tramoReceta ? tramoReceta.xpPorReceta : 1;

      const recetasNecesarias = Math.ceil((xpEnTramo / bonusFactor) / xpPorReceta);

      this.resultadosPorTramo.push({
        rangoInicio: desde,
        rangoFin: hasta,
        casillas: rango.casillas,
        xpTramo: xpEnTramo,
        recetasNecesarias,
      });
    }

    this.resultadosResumenDinamic = [];
    const rangoUsado = `${this.nivelActual} a ${this.nivelObjetivo}`;

    for (const tramoReceta of this.tramosRecetas) {
      if (this.nivelActual >= tramoReceta.minNivel && this.nivelActual < tramoReceta.maxNivel) {
        const recetasNecesariasDinamic = Math.ceil((this.xpFaltante / bonusFactor) / tramoReceta.xpPorReceta);
        this.resultadosResumenDinamic.push({
          rango: rangoUsado,
          casillas: tramoReceta.casillas,
          recetasNecesarias: recetasNecesariasDinamic,
        });
      }
    }
  }
}
