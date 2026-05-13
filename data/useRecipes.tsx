import { addItem, clearShoppingList, getAllItems, removeItem, toggleItem, updateItem } from '@/data/database';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext, useEffect, useReducer,
  useState,
} from 'react';
import {
  dbDelete,
  dbGetAll,
  dbInsert,
  dbSearch,
  dbUpdate
} from '../data/database';
import { Recipe, RecipeInput } from '../data/types';

type State = { recipes: Recipe[]; loading: boolean };

type Action =
  | { type: 'LOAD';   payload: Recipe[] }
  | { type: 'ADD';    payload: Recipe }
  | { type: 'UPDATE'; payload: Recipe }
  | { type: 'DELETE'; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':   return { recipes: action.payload, loading: false };
    case 'ADD':    return { ...state, recipes: [action.payload, ...state.recipes] };
    case 'UPDATE': return { ...state, recipes: state.recipes.map(r => r.id === action.payload.id ? action.payload : r) };
    case 'DELETE': return { ...state, recipes: state.recipes.filter(r => r.id !== action.payload) };
  }
}

type RecipesContextType = State & {
  addRecipe:       (input: RecipeInput) => Promise<Recipe>;
  updateRecipe:    (id: number, input: RecipeInput) => Promise<Recipe>;
  deleteRecipe:    (id: number) => Promise<void>;
  getRecipe:       (id: number) => Recipe | undefined;
  searchRecipes:   (q: string, regime?: string, type?: string) => Promise<Recipe[]>;

  shoppingList: any[];
  addRecipeToShoppingList: (id: number) => Promise<void>;
  addItemToShoppingList: (name: string, quantity: number, unit: string) => Promise<void>;
  toggleShoppingItem: (id: number) => Promise<void>;
  removeShoppingItem: (id: number) => Promise<void>;
  clearList: () => Promise<void>;
  updateShoppingItem: (id: number, name: string, quantity: number, unit: string) => Promise<void>;


};

const RecipesContext = createContext<RecipesContextType | null>(null);

export function RecipesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { recipes: [], loading: true });
  const [shoppingList, setShoppingList] = useState<any[]>([]);

  useEffect(() => {
    dbGetAll()
      .then(recipes => dispatch({ type: 'LOAD', payload: recipes }))
      .catch(() => dispatch({ type: 'LOAD', payload: [] }));
  }, []);
  
  useEffect(() => {
    loadShoppingList();
  }, []);
  async function loadShoppingList() {
    const items = await getAllItems();
    setShoppingList(items);
  }

  //-------------------------- RECIPES -------------------------------------------------

  const addRecipe = useCallback(async (input: RecipeInput): Promise<Recipe> => {
    const saved = await dbInsert(input);
    dispatch({ type: 'ADD', payload: saved });
    return saved;
  }, []);

  const updateRecipe = useCallback(async (id: number, input: RecipeInput): Promise<Recipe> => {
    const updated = await dbUpdate(id, input);
    dispatch({ type: 'UPDATE', payload: updated });
    return updated;
  }, []);

  const deleteRecipe = useCallback(async (id: number): Promise<void> => {
    await dbDelete(id);
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const getRecipe      = useCallback((id: number) => state.recipes.find(r => r.id === id), [state.recipes]);
  const searchRecipes  = useCallback((q: string, regime?: string, type?: string) => dbSearch(q, regime, type), []);

  //---------------------------SHOPPING LIST-----------------------------------------------------------------------------

  const addRecipeToShoppingList = useCallback(
    async (id: number) => {
      const recipe = state.recipes.find((r) => r.id === id);
      if (!recipe) return;

      // Ajouter chaque ingrédient dans SQLite
      for (const ing of recipe.ingredients) {
        await addItem(ing.name, ing.quantity, ing.unit);
      }

      await loadShoppingList();
    },
    [state.recipes]
  );

  const addItemToShoppingList = useCallback(
    async (name: string, quantity: number, unit: string) => {
      await addItem(name, quantity, unit);
      await loadShoppingList();
    }, []
  )

  const toggleShoppingItem = useCallback(async (id: number) => {
    await toggleItem(id);
    await loadShoppingList();
  }, []);

  const removeShoppingItem = useCallback(async (id: number) => {
    await removeItem(id);
    await loadShoppingList();
  }, []);

  const clearList = useCallback(async () => {
    await clearShoppingList();
    await loadShoppingList();
  }, []);

  const updateShoppingItem = useCallback(async (id: number, name: string, quantity: number, unit: string) => {
    await updateItem(id, name, quantity, unit);
    await loadShoppingList();
}, []);


  return (
    <RecipesContext.Provider value={{ ...state, 
      addRecipe, 
      updateRecipe, 
      deleteRecipe, 
      getRecipe, 
      searchRecipes, 
      shoppingList,
      addRecipeToShoppingList,
      addItemToShoppingList,
      toggleShoppingItem,
      removeShoppingItem,
      clearList,
      updateShoppingItem}}>
      {children}
    </RecipesContext.Provider>
  );
}

export function useRecipes(): RecipesContextType {
  const ctx = useContext(RecipesContext);
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider');
  return ctx;
}
