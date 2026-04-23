export const recipeSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
        type: 'string',
        maxLength: 100,
        },
        title: {
        type: 'string',
        },
        time: {
        type: 'number',
        minimum: 1,
        },
        type: {
        type: 'string',
        enum: ['Entrée', 'Plat', 'Dessert', 'Snack', 'Boisson'],
        },
        regime: {
        type: 'string',
        enum: ['Standard', 'Végé', 'Vegan'],
        },
        ingredients: {
            type: 'array',
            items: { type: 'object',
                properties: {
                    quantity: { type: 'string' }, // Passer en number ? Mais souvent les quantités sont mixtes (ex: "1/2", "1-2", "une pincée")...
                    unity: { type: 'string' }, // Ajout d'une unité pour plus de clarté ?
                    name: { type: 'string' },
                },
            },
        },
        steps: {
        type: 'array',
        items: { type: 'string' },
        },
    },
    required: ['id', 'title', 'time', 'type', 'regime', 'ingredients', 'steps'],
    indexes: ['type', 'time', 'regime'],
};

export const shoppingListSchema = {
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100,
        },
        quantity: { 
            type: 'string' // Passer en number ? Mais souvent les quantités sont mixtes (ex: "1/2", "1-2", "une pincée")...
        }, 
        unity: { 
            type: 'string'  // Ajout d'une unité pour plus de clarté ?
        },
        name: { 
            type: 'string' 
        },
        isActive: { 
            type: 'boolean' 
        },
    },
    required: ['id'],
};