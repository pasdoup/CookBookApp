import * as SQLite from "expo-sqlite";
import { Ingredient, Recipe, RecipeInput, ShoppingItem } from "./types";


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

//------------------------------Recipe
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

//-------------------------------Shopping

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
// -------------------------------------- Default
async function insertDefaultRecipes(db: SQLite.SQLiteDatabase) {

  const ins = (title: string, time: number, type: string, regime: string,
               ingredients: Ingredient[], steps: string[]) =>
    db.runAsync(
      'INSERT INTO recipes (title, time, type, regime, ingredients, steps) VALUES (?, ?, ?, ?, ?, ?)',
      [title, time, type, regime, JSON.stringify(ingredients), JSON.stringify(steps)]
    );

  await ins('Ratatouille provençale', 60, 'Plat', 'Végé',
    [{ name: 'courgettes', quantity: 2, unit: '' }, { name: 'aubergines', quantity: 2, unit: '' },
     { name: 'tomates', quantity: 3, unit: '' }, { name: 'oignons', quantity: 2, unit: '' },
     { name: "herbes de Provence", quantity: 2, unit: 'cs' }, { name: "huile d'olive", quantity: 3, unit: 'cs' }],
    ["Couper les légumes en rondelles.", "Faire revenir les oignons.", "Ajouter les légumes et cuire 45 min à feu doux."]
  );
  await ins('Spaghetti Carbonara', 25, 'Plat', 'Standard',
    [{ name: 'spaghetti', quantity: 400, unit: 'g' }, { name: 'lardons fumés', quantity: 150, unit: 'g' },
     { name: 'œufs', quantity: 3, unit: '' }, { name: 'parmesan râpé', quantity: 100, unit: 'g' },
     { name: 'poivre noir', quantity: 0, unit: '' }],
    ["Cuire les pâtes al dente.", "Rissoler les lardons.", "Mélanger œufs + parmesan hors du feu avec les pâtes."]
  );
  await ins('Buddha Bowl vegan', 20, 'Plat', 'Vegan',
    [{ name: 'quinoa cuit', quantity: 150, unit: 'g' }, { name: 'pois chiches', quantity: 1, unit: 'boite' },
     { name: 'avocat', quantity: 1, unit: '' }, { name: 'épinards frais', quantity: 100, unit: 'g' },
     { name: 'sauce tahini', quantity: 3, unit: 'cs' }, { name: 'citron', quantity: 1, unit: '' }],
    ["Rôtir les pois chiches 20 min à 200°C.", "Disposer le quinoa dans un bol.", "Ajouter les garnitures et arroser de tahini."]
  );
  await ins('Soupe de lentilles', 35, 'Boisson', 'Vegan',
    [{ name: 'lentilles corail', quantity: 250, unit: 'g' }, { name: 'oignon', quantity: 1, unit: '' },
     { name: 'carottes', quantity: 2, unit: '' }, { name: 'cumin', quantity: 1, unit: 'cc' },
     { name: 'curcuma', quantity: 1, unit: 'cc' }, { name: 'bouillon légumes', quantity: 1, unit: 'l' }],
    ["Revenir oignon et carottes.", "Ajouter épices et lentilles.", "Cuire 25 min, mixer partiellement."]
  );
  await ins('Tiramisu classique', 30, 'Dessert', 'Standard',
    [{ name: 'mascarpone', quantity: 500, unit: 'g' }, { name: 'œufs', quantity: 4, unit: '' },
     { name: 'sucre', quantity: 80, unit: 'g' }, { name: 'biscuits cuillère', quantity: 200, unit: 'g' },
     { name: 'café fort', quantity: 200, unit: 'ml' }, { name: 'cacao amer', quantity: 2, unit: 'cs' }],
    ["Fouetter jaunes + sucre. Incorporer mascarpone.", "Monter blancs en neige et incorporer.", "Alterner couches biscuits/crème. Réfrigérer 4h."]
  );
  await ins('Poulet curry coco', 40, 'Plat', 'Végé',
    [{ name: 'blanc de poulet', quantity: 600, unit: 'g' }, { name: 'lait de coco', quantity: 400, unit: 'ml' },
     { name: 'curry', quantity: 2, unit: 'cs' }, { name: 'oignon', quantity: 1, unit: '' }],
    ["Revenir oignon. Ajouter curry.", "Dorer le poulet.", "Verser le lait de coco et mijoter 20 min."]
  );
  await ins('Omelette champignons', 15, 'Plat', 'Végé',
    [{ name: 'œufs', quantity: 4, unit: '' }, { name: 'champignons', quantity: 200, unit: 'g' },
     { name: 'échalote', quantity: 1, unit: '' }, { name: 'beurre', quantity: 20, unit: 'g' }],
    ["Sauter champignons + échalote.", "Battre les œufs.", "Cuire l'omelette et garnir."]
  );
  await ins('Bruschetta tomates', 10, 'Entrée', 'Vegan',
    [{ name: 'pain de campagne', quantity: 4, unit: 'tranches' }, { name: 'tomates', quantity: 3, unit: '' },
     { name: "gousses d'ail", quantity: 2, unit: '' }, { name: 'basilic frais', quantity: 0, unit: '' },
     { name: "huile d'olive", quantity: 2, unit: 'cs' }],
    ["Griller le pain.", "Frotter avec l'ail.", "Garnir de tomates concassées et basilic."]
  );
}
