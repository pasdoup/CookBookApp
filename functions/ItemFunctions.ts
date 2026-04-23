import { ShoppingList } from "@/data/ShoppingList";

export function getItems() {
    let items = ShoppingList;
    return items;
}

export function addOneItem(item: any) {
    try {
        const newItem = typeof item === 'string' ? JSON.parse(item) : item;
        const itemToAdd = {
            id: (ShoppingList.length + 1).toString(),
            quantity: newItem.quantity || '',
            unity: newItem.unity || '',
            name: newItem.name || '',
            isActive: true,
        };
        ShoppingList.push(itemToAdd);
        console.log("Item ajouté :", itemToAdd);
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'item :", error);
    }
}

export function addItems(newItems: any[]) {
    for (const item of newItems) {
        addOneItem(item);
    }
}

export function removeOneItem(index: number) {
    ShoppingList.splice(index, 1);
}   

export function updateOneItem(index: number, updatedItem: any) {
    ShoppingList[index] = {
        ...ShoppingList[index],
        quantity: updatedItem.quantity ?? ShoppingList[index].quantity,
        unity: updatedItem.unity ?? ShoppingList[index].unity,
        name: updatedItem.name ?? ShoppingList[index].name,
    };
}

export function activeOneItem(index: number) {
    ShoppingList[index].isActive = !ShoppingList[index].isActive;
}

export function reinitItems() {
    ShoppingList.length = 0;
}