export type Ingredient = {
  name:     string;
  quantity: number;
  unit:     string;
};

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

export type Recipe = {
  id:          number;
  title:       string;
  time:        number;
  type:        RecipeType;
  regime:      RecipeRegime;
  ingredients: Ingredient[];
  steps:       string[];
};

export type RecipeInput = Omit<Recipe, 'id'>;
