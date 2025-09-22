import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


export interface Recipe {
  name: string;
  ingredients: { [key: string]: number };
  subRecipes?: { [key: string]: { [key: string]: number } };
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.html',
  styleUrls: ['./calculator.css']
})
export class CalculatorComponent {
	// Esto debe estar aquí, dentro de la clase
  objectKeys = Object.keys;
  recipes: Recipe[] = [
    {
      name: 'Pan de las Urbes',
      ingredients: {'harina de malta': 1, 'malta': 1, 'agua': 1},
      subRecipes: {
        'harina de malta': {'malta': 2}
      }
    }
  ];

  selectedRecipe?: Recipe;
  quantity: number = 1;
  result: { [key: string]: number } = {};

  calculate() {
    if (!this.selectedRecipe || this.quantity < 1) return;

    this.result = {};

    for (const [ingredient, amount] of Object.entries(this.selectedRecipe.ingredients)) {
      const typedAmount: number = amount as number;

      if (this.selectedRecipe.subRecipes && this.selectedRecipe.subRecipes[ingredient]) {
        const subIng = this.selectedRecipe.subRecipes[ingredient];
        for (const [subIngredient, subAmount] of Object.entries(subIng)) {
          const typedSubAmount: number = subAmount as number;

          this.result[subIngredient] = (this.result[subIngredient] || 0) + typedSubAmount * typedAmount * this.quantity;
        }
      } else {
        this.result[ingredient] = (this.result[ingredient] || 0) + typedAmount * this.quantity;
      }
    }
  }
}
