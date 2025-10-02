import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Recipe {
  name: string;
  ingredients: { [key: string]: number };
}

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.html',
  styleUrls: ['./calculator.css']
})
export class CalculatorComponent {
  recipes: Recipe[] = [
    {
      name: 'Pan de las Urbes',
      ingredients: { 'Harina de malta': 1, 'Malta': 1, 'Agua': 1 }
    },
    {
      name: 'Pan Bumbo',
      ingredients: {
        'Levadura del panadero': 1,
        'Agua': 1,
        'Harina de cebada': 1,
        'Harina blanca': 1,
        'Harina de avena': 1,
        'Harina atrevida': 1,
        'Harina tradicional': 1
      }
    },
    {
      name: 'Pan de los Campos',
      ingredients: {
        'Harina de trigo': 1,
        'Harina de lino': 1,
        'Levadura del panadero': 1,
        'Agua': 1,
        'Harina de malta': 1
      }
    },
    {
      name: 'Pan de cereales',
      ingredients: {
        'Harina de trigo': 1,
        'Harina de cebada': 1,
        'Harina de avena': 1,
        'Harina de centeno': 1,
        'Levadura del panadero': 1,
        'Agua': 1
      }
    },
    {
      name: 'Pan de frostizz',
      ingredients: {
        'Levadura del panadero': 1,
        'Agua': 1,
        'Harina de cebada': 1,
        'Harina de malta': 1,
        'Harina tradicional': 1,
        'Harina de frostizz': 1,
        'Harina de Javier el Panadero': 1,
        'Harina de lúpulo': 1
      }
    },
    {
      name: 'Pan de centeno resistente',
      ingredients: {
        'Levadura del panadero': 1,
        'Harina de centeno mágico': 1,
        'Agua': 1
      }
    },
    {
      name: 'Pan de avena',
      ingredients: {
        'Levadura del panadero': 1,
        'Harina de avena': 1,
        'Agua': 1
      }
    },
    {
      name: 'Pan de trigo',
      ingredients: {
        'Harina de trigo': 1,
        'Trigo': 1,
        'Levadura del panadero': 1,
        'Agua': 1
      }
    }
  ];

  selectedRecipe?: Recipe;
  quantity: number = 1;

  specialHarinas: { [key: string]: { [key: string]: number } } = {
    'Harina blanca': { 'Trigo': 2, 'Centeno': 2 },
    'Harina atrevida': { 'Trigo': 2, 'Cebada': 2, 'Centeno': 2 },
    'Harina tradicional': { 'Trigo': 2, 'Cebada': 2, 'Centeno': 2, 'Avena': 2 },
    'Harina integral': { 'Trigo': 2, 'Lúpulo': 2, 'Avena': 2, 'Centeno': 2, 'Cañamo': 2 },
    'Harina de Javier el Panadero': {
      'Trigo': 2,
      'Cebada': 2,
      'Lúpulo': 2,
      'Malta': 2,
      'Lino': 2,
      'Centeno': 2,
      'Avena': 2,
      'Cañamo': 2
    }
  };

  recipeForOne: { [key: string]: number } = {};
  harinasToCreate: { [key: string]: number } = {};
  harinaRecipes: { [key: string]: { [key: string]: number } } = {};
  totals: { [key: string]: number } = {};

  calculate() {
    if (!this.selectedRecipe) return;

    this.recipeForOne = { ...this.selectedRecipe.ingredients };
    this.harinasToCreate = {};
    this.harinaRecipes = {};
    this.totals = {};

    for (const [ingredient, amount] of Object.entries(this.recipeForOne)) {
      if (this.specialHarinas[ingredient]) {
        this.harinasToCreate[ingredient] = amount;
        this.harinaRecipes[ingredient] = this.specialHarinas[ingredient];
      } else if (ingredient.toLowerCase().includes('harina')) {
        this.harinasToCreate[ingredient] = amount;
      } else {
        this.totals[ingredient] = (this.totals[ingredient] || 0) + amount * this.quantity;
      }
    }

    for (const [harina, amount] of Object.entries(this.harinasToCreate)) {
      if (this.harinaRecipes[harina]) {
        for (const [base, cant] of Object.entries(this.harinaRecipes[harina])) {
          this.totals[base] = (this.totals[base] || 0) + cant * amount * this.quantity;
        }
      } else {
        const recursoBase = this.getBaseCereal(harina) || harina.replace(/harina de /i, '').trim();
        const nombreFormateado = recursoBase.charAt(0).toUpperCase() + recursoBase.slice(1);
        this.totals[nombreFormateado] = (this.totals[nombreFormateado] || 0) + amount * 2 * this.quantity;
      }
    }
  }

  getBaseCereal(harina: string): string | undefined {
    if (harina.toLowerCase().includes('malta')) return 'Malta';
    if (harina.toLowerCase().includes('trigo')) return 'Trigo';
    if (harina.toLowerCase().includes('cebada')) return 'Cebada';
    if (harina.toLowerCase().includes('avena')) return 'Avena';
    if (harina.toLowerCase().includes('centeno')) return 'Centeno';
    if (harina.toLowerCase().includes('lino')) return 'Lino';
    if (harina.toLowerCase().includes('lupulo')) return 'Lúpulo';
    if (harina.toLowerCase().includes('cañamo')) return 'Cañamo';
    return undefined;
  }

  // Devuelve los ingredientes en filas de dos para mostrar columnas
  getIngredientRows(ingredientes: {[key:string]: number}, total: number): {nombre: string, cantidad: number}[][] {
    const items = Object.keys(ingredientes).map(k => ({
      nombre: k,
      cantidad: ingredientes[k] * total
    }));
    const rows = [];
    for (let i = 0; i < items.length; i += 2) {
      rows.push(items.slice(i, i + 2));
    }
    return rows;
  }

  objectKeys = Object.keys;
}
