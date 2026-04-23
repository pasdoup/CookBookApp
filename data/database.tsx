import * as SQLite from "expo-sqlite";

let _db: SQLite.SQLiteDatabase;

export async function getDb() {
  if (_db) return _db;

  _db = await SQLite.openDatabaseAsync("cookbook.db");
  await initSchema(_db);

  return _db;
}

async function initSchema(db: SQLite.SQLiteDatabase) {
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

  const row = await db.getFirstAsync("SELECT COUNT(*) as cnt FROM recipes");

  if (row === 0) {
    await insertDefaultRecipes(db);
  }
}

async function insertDefaultRecipes(db: SQLite.SQLiteDatabase) {
  const defaultRecipes = [
    {
      title: "Pâtes à la carbonara",
      time: 20,
      type: "plat",
      regime: "Standard",
      ingredients: [
        { name: "Spaghetti", quantity: 200, unit: "g" },
        { name: "Lardons", quantity: 100, unit: "g" },
        { name: "Œufs", quantity: 2, unit: "" },
        { name: "Parmesan", quantity: 50, unit: "g" },
        { name: "Sel", quantity: 1, unit: "pincée" },
        { name: "Poivre", quantity: 1, unit: "pincée" }
      ],
      steps: [
        "Cuire les pâtes.",
        "Faire revenir les lardons.",
        "Mélanger œufs + parmesan.",
        "Ajouter les pâtes chaudes et mélanger.",
        "Assaisonner."
      ]
    },
    {
      title: "Curry de légumes",
      time: 30,
      type: "plat",
      regime: "Vegan",
      ingredients: [
        { name: "Pois chiches", quantity: 200, unit: "g" },
        { name: "Carottes", quantity: 150, unit: "g" },
        { name: "Pommes de terre", quantity: 150, unit: "g" },
        { name: "Lait de coco", quantity: 200, unit: "ml" },
        { name: "Pâte de curry", quantity: 1, unit: "c.à.s" },
        { name: "Sel", quantity: 1, unit: "pincée" }
      ],
      steps: [
        "Couper les légumes.",
        "Faire revenir la pâte de curry.",
        "Ajouter légumes + lait de coco.",
        "Laisser mijoter 20 min.",
        "Ajouter pois chiches et saler."
      ]
    },
    {
      title: "Salade César",
      time: 15,
      type: "plat",
      regime: "Végé",
      ingredients: [
        { name: "Laitue romaine", quantity: 1, unit: "" },
        { name: "Poulet", quantity: 150, unit: "g" },
        { name: "Parmesan", quantity: 30, unit: "g" },
        { name: "Sauce César", quantity: 2, unit: "c.à.s" },
        { name: "Poivre", quantity: 1, unit: "pincée" }
      ],
      steps: [
        "Cuire le poulet.",
        "Couper la salade.",
        "Mélanger avec la sauce.",
        "Ajouter poulet et parmesan.",
        "Poivrer."
      ]
    }
  ];

  for (const r of defaultRecipes) {
    await db.runAsync(
      `INSERT INTO recipes (title, time, type, regime, ingredients, steps)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        r.title,
        r.time,
        r.type,
        r.regime,
        JSON.stringify(r.ingredients),
        JSON.stringify(r.steps)
      ]
    );
  }
}
