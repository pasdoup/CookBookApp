import * as SQLite from "expo-sqlite";
import { Ingredient, Recipe, RecipeInput, ShoppingItem } from "./types";


const DB_VERSION = 3;
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
    steps:       JSON.parse(row.steps)       as string[],
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

export async function dbSearch(q: string, regime?: string, type?: string): Promise<Recipe[]> {
  const db     = await getDb();
  const parts: string[]           = [];
  const params: (string | number)[] = [];

  if (q.trim()) {
    parts.push('(LOWER(title) LIKE ? OR LOWER(ingredients) LIKE ?)');
    const term = `%${q.toLowerCase()}%`;
    params.push(term, term);
  }
  if (regime && regime !== 'Tous') { parts.push('regime = ?'); params.push(regime); }
  if (type   && type   !== 'Tous') { parts.push('type = ?');   params.push(type);   }

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
async function insertDefaultRecipes(db: SQLite.SQLiteDatabase) {

  const ins = (title: string, time: number, type: string, regime: string,
               ingredients: Ingredient[], steps: string[]) =>
    db.runAsync(
      'INSERT INTO recipes (title, time, type, regime, ingredients, steps) VALUES (?, ?, ?, ?, ?, ?)',
      [title, time, type, regime, JSON.stringify(ingredients), JSON.stringify(steps)]
    );

  await ins('Gâteau au chocolat', 30, 'Dessert', 'Standard',
    [{ name: 'chocolat', quantity: 200, unit: 'g' }, { name: 'beurre demi-sel', quantity: 200, unit: 'g' },
     { name: 'oeufs', quantity: 4, unit: '' }, { name: 'sucre', quantity: 200, unit: 'g' },
     { name: "farine", quantity: 1, unit: 'cs' }],
    ["Préchauffer le four à 180°C.","Dans une casserole à feu doux, faire fondre le beurre avec le chocolat.", 
      "Dans un saladier battre les oeufs avec le sucre et ajouter la farine", "Incorporer le chocolat fondu dans le saladier.", 
      "Verser la préparation dans un moule bien beurré", "Mettre au four 20min."]
  );

  await ins('Poulet curry', 20, 'Plat', 'Standard',
    [{ name: 'blanc de poulet', quantity: 200, unit: 'g' }, { name: 'lait de coco', quantity: 10, unit: 'cl' },
     { name: 'crème fraiche', quantity: 25, unit: 'cl' }, { name: 'curry', quantity: 1, unit: '' }],
    ["Découper le blanc de poulet en petits morceaux.",
      "Faire dorer le poulet dans une casserole.", 
      "Ajouter la crème et le coco à la casserole.", 
      "Ajouter au tant de curry souhaité.", "Laisser réduire dans la casserole."]
  );
}
