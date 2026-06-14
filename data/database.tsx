import * as SQLite from "expo-sqlite";
import { defaultRecipes } from './data';
import { Ingredient, Recipe, RecipeInput, ShoppingItem, Step } from "./types";


const DB_VERSION = 2;
let _db: SQLite.SQLiteDatabase | null = null;
let _dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  if (_dbPromise) return _dbPromise;
  _dbPromise = (async () => {
    const db = await SQLite.openDatabaseAsync("cookbook.db");
    await initializeDb(db);
    _db = db;
    return db;
  })();
  return _dbPromise;
}

export async function initializeDb(db: SQLite.SQLiteDatabase) {
  await db.execAsync('PRAGMA journal_mode = WAL;');
    await db.execAsync(`
    CREATE TABLE IF NOT EXISTS db_meta (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS recipes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      time        INTEGER NOT NULL DEFAULT 30,
      type        TEXT NOT NULL DEFAULT 'Plat',
      regime      TEXT NOT NULL DEFAULT 'Standard',
      ingredients TEXT NOT NULL,
      steps       TEXT NOT NULL
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS shopping_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      checked INTEGER NOT NULL DEFAULT 0
    );
  `);

  // Lire la version actuelle en base
  const meta = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM db_meta WHERE key = 'version'"
  );
  const storedVersion = meta ? parseInt(meta.value, 10) : 0;
  if (storedVersion !== DB_VERSION) {
    // Nouvelle version : vider les données et re-seeder
    await db.execAsync("DELETE FROM recipes;");
    await db.execAsync("DELETE FROM shopping_list;");
   await insertDefaultRecipes(db);
   await db.runAsync(
      "INSERT OR REPLACE INTO db_meta (key, value) VALUES ('version', ?)",
      [String(DB_VERSION)]
    );
  }
}

//------------------------------ Recipe --------------------------------------------------
type RecipeRow = {
  id: number; title: string; time: number;
  type: string; regime: string;
  ingredients: string; steps: string;
};

function _rowToRecipe(row: RecipeRow): Recipe {
  return {
    id:          row.id,
    title:       row.title,
    time:        row.time,
    type:        row.type   as Recipe['type'],
    regime:      row.regime as Recipe['regime'],
    ingredients: JSON.parse(row.ingredients) as Ingredient[],
    steps:       JSON.parse(row.steps)       as Step[],
  };
}

export async function dbGetAll(): Promise<Recipe[]> {
  const db   = await getDb();
  const rows = await db.getAllAsync<RecipeRow>('SELECT * FROM recipes ORDER BY id DESC');
  return rows.map(_rowToRecipe);
}

export async function dbGetById(id: number): Promise<Recipe | null> {
  const db  = await getDb();
  const row = await db.getFirstAsync<RecipeRow>('SELECT * FROM recipes WHERE id = ?', [id]);
  return row ? _rowToRecipe(row) : null;
}

export async function dbInsert(input: RecipeInput): Promise<Recipe> {
  const db     = await getDb();
  const result = await db.runAsync(
    'INSERT INTO recipes (title, time, type, regime, ingredients, steps) VALUES (?, ?, ?, ?, ?, ?)',
    [input.title, input.time, input.type, input.regime,
     JSON.stringify(input.ingredients), JSON.stringify(input.steps)]
  );
  const inserted = await dbGetById(result.lastInsertRowId);
  if (!inserted) throw new Error('Insert failed');
  return inserted;
}

export async function dbUpdate(id: number, input: RecipeInput): Promise<Recipe> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE recipes SET title=?, time=?, type=?, regime=?, ingredients=?, steps=? WHERE id=?',
    [input.title, input.time, input.type, input.regime,
     JSON.stringify(input.ingredients), JSON.stringify(input.steps), id]
  );
  const updated = await dbGetById(id);
  if (!updated) throw new Error('Update failed');
  return updated;
}

export async function dbDelete(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
}

export async function dbSearch(q: string, regimes: string[], types: string[]): Promise<Recipe[]> {
  const db = await getDb();
  const parts: string[] = [];
  const params: (string | number)[] = [];

  if (q.trim()) {
    parts.push('(LOWER(title) LIKE ? OR LOWER(ingredients) LIKE ?)');
    const term = `%${q.toLowerCase()}%`;
    params.push(term, term);
  }
  if (regimes.length > 0) {
    parts.push(`regime IN (${regimes.map(() => '?').join(',')})`);
    params.push(...regimes);
  }
  if (types.length > 0) {
    parts.push(`type IN (${types.map(() => '?').join(',')})`);
    params.push(...types);
  }

  const where = parts.length ? `WHERE ${parts.join(' AND ')}` : '';
  const rows  = await db.getAllAsync<RecipeRow>(
    `SELECT * FROM recipes ${where} ORDER BY id DESC`, params
  );
  return rows.map(_rowToRecipe);
}

//------------------------------- Shopping ----------------------------------------------

export async function addItem(name: string, quantity: number, unit: string) {
  const db = await getDb();
  // Vérifier si l’ingrédient existe déjà
  const existing = await db.getFirstAsync<ShoppingItem>(
    "SELECT * FROM shopping_list WHERE upper(name) = ? AND unit = ?",
    [name.toUpperCase(), unit]
  );
  if (existing) {
    await db.runAsync(
      "UPDATE shopping_list SET quantity = quantity + ? WHERE id = ?",
      [quantity, existing.id]
    );
    return;
  }
  await db.runAsync(
    "INSERT INTO shopping_list (name, quantity, unit) VALUES (?, ?, ?)",
    [name, quantity, unit]
  );
}

export async function getAllItems() {
  const db = await getDb();
  return await db.getAllAsync<ShoppingItem>("SELECT * FROM shopping_list ORDER BY name ASC");
}

export async function toggleItem(id: number) {
  const db = await getDb();
  await db.runAsync(
    "UPDATE shopping_list SET checked = 1 - checked WHERE id = ?",
    [id]
  );
}

export async function removeItem(id: number) {
  const db = await getDb();
  await db.runAsync("DELETE FROM shopping_list WHERE id = ?", [id]);
}

export async function clearShoppingList() {
  const db = await getDb();
  await db.runAsync("DELETE FROM shopping_list");
}

export async function updateItem(id: number, name: string, quantity: number, unit: string) {
  const db = await getDb();
  await db.runAsync(
    `UPDATE shopping_list
     SET name = ?, quantity = ?, unit = ?
     WHERE id = ?`,
    [name, quantity, unit, id]
  );
}
// -------------------------------------- Default ----------------------------------------
async function insertMultipleRecipes(recipes: RecipeInput[]): Promise<number>{
  let count: number = 0;
  for (const item of recipes) {
    if (typeof item !== 'object' || !item.title || !Array.isArray(item.ingredients)   || !Array.isArray(item.steps)) {
      continue;
    }
    const ingredients: Ingredient[] = item.ingredients
      .map((ing: any) => ({
        name: typeof ing.name === 'string' ? ing.name.trim() : '',
        quantity: typeof ing.quantity === 'number' ? ing.quantity : 0,
        unit: typeof ing.unit === 'string' ? ing.unit.trim() : '',
      })).filter((ing: Ingredient) => ing.name !== '');

    const steps: Step[] = item.steps
      .map((s: any, index: number) => ({
        order: typeof s.order === 'number' ? s.order : index + 1,
        value: typeof s.value === 'string' ? s.value.trim() : '',
      }))
      .filter((s: Step) => s.value !== '');

    if (ingredients.length === 0 || steps.length === 0) {
      continue;
    }

    const payload = {
      title:       String(item.title).trim(),
      time:        typeof item.time === 'number' ? item.time : 30,
      type:        item.type   ?? 'Plat',
      regime:      item.regime ?? 'Standard',
      ingredients,
      steps,
    };
    await dbInsert(payload);
    count++;
  }
  return count;
}
async function insertDefaultRecipes(db: SQLite.SQLiteDatabase) {

  const ins = (title: string, time: number, type: string, regime: string,
               ingredients: Ingredient[], steps: Step[]) =>
    db.runAsync(
      'INSERT INTO recipes (title, time, type, regime, ingredients, steps) VALUES (?, ?, ?, ?, ?, ?)',
      [title, time, type, regime, JSON.stringify(ingredients), JSON.stringify(steps)]
    );
  const recipes = defaultRecipes;
  for (const recipe of recipes) {
    await ins(recipe.title, recipe.time, recipe.type, recipe.regime, recipe.ingredients, recipe.steps);
  }
}
