import { getDb } from "./database";

// -----------------------------
// Types
// -----------------------------

export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
};

export type Recipe = {
  id?: number;
  title: string;
  time: number;
  type: string;
  regime: string;
  ingredients: Ingredient[];
  steps: string[];
};

export type RecipeRow = {
  id?: number;
  title: string;
  time: number;
  type: string;
  regime: string;
  ingredients: string;
  steps: string;
};

// -----------------------------
// CRUD Repository
// -----------------------------


export async function getAllRecipes(): Promise<Recipe[]> {
  const db = await getDb();
  const rows = await db.getAllAsync("SELECT * FROM recipes");

  return rows.map((row: any) => ({
    ...row,
    ingredients: JSON.parse(row.ingredients),
    steps: JSON.parse(row.steps),
  }));
}

export async function getRecipeById(id: number): Promise<Recipe | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<RecipeRow>("SELECT * FROM recipes WHERE id = ?", [id]);

  if (!row) return null;

  return {
    ...row,
    ingredients: JSON.parse(row.ingredients),
    steps: JSON.parse(row.steps),
  };
}

export async function createRecipe(recipe: Recipe): Promise<number> {
  const db = await getDb();

  const result = await db.runAsync(
    `
    INSERT INTO recipes (title, time, type, regime, ingredients, steps)
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      recipe.title,
      recipe.time,
      recipe.type,
      recipe.regime,
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.steps),
    ]
  );

  return result.lastInsertRowId;
}

export async function updateRecipe(id: number, recipe: Recipe): Promise<void> {
  const db = await getDb();

  await db.runAsync(
    `
    UPDATE recipes
    SET title = ?, time = ?, type = ?, regime = ?, ingredients = ?, steps = ?
    WHERE id = ?
    `,
    [
      recipe.title,
      recipe.time,
      recipe.type,
      recipe.regime,
      JSON.stringify(recipe.ingredients),
      JSON.stringify(recipe.steps),
      id,
    ]
  );
}

export async function deleteRecipe(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM recipes WHERE id = ?", [id]);
}
