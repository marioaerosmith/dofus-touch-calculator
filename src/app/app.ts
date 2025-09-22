import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Si usas rutas
import { CalculatorComponent } from './calculator/calculator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalculatorComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  protected readonly title = 'dofus-touch-calculator';
}
