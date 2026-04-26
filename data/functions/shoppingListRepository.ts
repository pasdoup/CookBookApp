import { getDb } from "../database";
import { ShoppingItem } from "../types";

export async function addItem(name: string, quantity: number, unit: string) {
  const db = await getDb();

  // Vérifier si l’ingrédient existe déjà
  const existing = await db.getFirstAsync<ShoppingItem>(
    "SELECT * FROM shopping_list WHERE name = ? AND unit = ?",
    [name, unit]
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
