import { Recipes } from "@/data/Recipes";

export function filterRecipes(search: string, activeTypes: string, activeRegimes: string) {
    let recipes = Recipes;
    if (activeTypes !== 'Tous') recipes = recipes.filter(recipe => recipe.type === activeTypes);
    if (activeRegimes !== 'Tous') recipes = recipes.filter(recipe => recipe.regime === activeRegimes);
    if (search) recipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(search.toLowerCase()));
    return recipes;
}

export function getRecipeById(id: number) {
    return Recipes.find(recipe => recipe.id === id)
}

export function getRandomRecipeId(activeTypes: string, activeRegimes: string) {
    const recipes = filterRecipes('', activeTypes, activeRegimes);
    if (recipes.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * recipes.length);
    return recipes[randomIndex].id;
}

export function createRecipe(recipe: any) {
    try {
        const newRecipe = typeof recipe === 'string' ? JSON.parse(recipe) : recipe;
        // Generate a new unique ID
        const newId = Math.max(...Recipes.map(r => r.id), 0) + 1;
        // Create the new recipe object
        const recipeToAdd = {
            id: newId,
            title: newRecipe.title || '',
            time: newRecipe.time || 0,
            type: newRecipe.type || 'Plat',
            regime: newRecipe.regime || 'Standard',
            ingredients: newRecipe.ingredients || [],
            steps: newRecipe.steps || [],
        };
        
        // Add to recipes array
        Recipes.push(recipeToAdd);
        console.log("Recette sauvegardée :", recipeToAdd);
        return newId;
    } catch (error) {
        console.error("Erreur lors de la création de la recette :", error);
        throw error;
    }
}

export function deleteRecipe(id: number) {
    try {
        const recipeIndex = Recipes.findIndex(recipe => recipe.id === id);
        if (recipeIndex !== -1) {
            Recipes.splice(recipeIndex, 1);
            console.log("Recette supprimée :", id);
            return true;
        } else {
            console.log("Recette non trouvée :", id);
            return false;
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la recette :", error);
        throw error;
    }
}   

export function updateRecipe(id: number, updatedRecipe: any) {
    try {
        const recipeIndex = Recipes.findIndex(recipe => recipe.id === id);
        if (recipeIndex !== -1) {
            Recipes[recipeIndex] = {
                ...Recipes[recipeIndex],
                title: updatedRecipe.title ?? Recipes[recipeIndex].title,
                time: updatedRecipe.time ?? Recipes[recipeIndex].time,
                type: updatedRecipe.type ?? Recipes[recipeIndex].type,
                regime: updatedRecipe.regime ?? Recipes[recipeIndex].regime,
                ingredients: updatedRecipe.ingredients ?? Recipes[recipeIndex].ingredients,
                steps: updatedRecipe.steps ?? Recipes[recipeIndex].steps,
            };
            console.log("Recette mise à jour :", id, Recipes[recipeIndex]);
            return Recipes[recipeIndex];
        } else {
            console.log("Recette non trouvée :", id);
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la recette :", error);
        throw error;
    }
}   
