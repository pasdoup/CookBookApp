export type Ingredient = {
  name:     string;
  quantity: number;
  unit:     string;
};

export type Step = {
  order:   number;
  value:   string;
};

export function emptyIngredient(): Ingredient {
  return { name: '', quantity: 0, unit: '' };
}
export function emptyStep(): Step {
  return { order: 1, value: '' };
}

export function formatIngredient(ing: Ingredient): string {
  const parts: string[] = [];
  if (ing.quantity > 0) parts.push(String(ing.quantity));
  if (ing.unit && ing.unit.trim()) parts.push(ing.unit.trim());
  parts.push(ing.name);
  return parts.join(' ');
}

export const UNITS: string[] = [
  'g', 'ml', 'cs', 'cc', '',
];

export type ShoppingItem = {
  id:       number;
  name:     string;
  quantity: number;
  unit:     string;
  checked:  number;
};

export type RecipeType = 'Entrée' | 'Plat' | 'Dessert' | 'Boisson' | 'Snack';
export type RecipeRegime     = 'Standard' | 'Végé' | 'Vegan';

export const RECIPE_TYPES: RecipeType[] = ['Entrée', 'Plat', 'Dessert', 'Boisson', 'Snack'];
export const RECIPE_REGIMES:      RecipeRegime[]     = ['Standard', 'Végé', 'Vegan'];
export const TIMES: number[] = [20, 30, 45]

export type Recipe = {
  id:          number;
  title:       string;
  time:        number;
  type:        RecipeType;
  regime:      RecipeRegime;
  ingredients: Ingredient[];
  steps:       Step[];
};

export type RecipeInput = Omit<Recipe, 'id'>;