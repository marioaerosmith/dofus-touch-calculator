import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalculatorComponent } from './calculator/calculator.component';
import { ExperienciaComponent } from './experiencia/experiencia.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CalculatorComponent, ExperienciaComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  showCalc = false;
  showExp = false;

  showCalculator() {
    this.showCalc = true;
    this.showExp = false;
  }

  showExperiencia() {
    this.showExp = true;
    this.showCalc = false;
  }
}

