# CookBook App

I'm still not sure if I want you to have access to that... So please be nice, it's my first mobile app and I could use some reassurance 🙈  
I'm not really sure what you're hoping to find in my code, but I guess you'll figure it out on your own.

The goal was to build a mobile app to store and organize my recipes, and get into the habit of actually writing them down.  
So I can find them more easily, get meal ideas, and stop eating the same thing every single evening.  
I wanted something simple, local storage only.

**Technical choice**:
 - React native
 - SqLite



## Features 

### recipes book

#### Search screen

 - Browse all recipes in one list

 - Filter by **type** *(Starter, Main, Dessert, Drink, Snack)* and/or **diet** *(Standard, Vegetarian, Vegan)*

 - Search by recipe **title** or **ingredients**

#### Recipe detail screen

 - Full recipe view *(time, type, ingredients, steps…)*

 - Button to **delete** the recipe

 - Button to **add ingredients** to the shopping list

 - Button to **edit** the recipe

#### Create / Edit screen

 - Set all recipe details *(title, ingredients, diet, prep time…)*

 - Add or remove ingredients and preparation steps

 - **Drag & drop** to reorder steps

---

 ### Recipe Generator

 - Randomly picks a recipe based on type, diet and preparation time filters

---

 ### Shopping List

 - Automatically generates an ingredient list from selected recipes

 - Edit ingredients in the list

 - Add extra ingredients manually

 - Check off or remove ingredients

--- 

 ### Settings

 - **Export** all recipes as a JSON file

 - **Import** recipes from a JSON file

## Project Structure
```
app/                  
├── (tabs)/             # Navigation principale  
│   ├── index.tsx       # Recherche & liste  
│   ├── shopping.tsx    # Liste de courses  
│   ├── random.tsx      # Générateur aléatoire  
│   └── settings.tsx    # Import / Export  
└── recipe/             # Écrans recette  
├── [id].tsx            # Détail  
├── createRecipe        # Création  
└── updateRecipe        # Modification  

components/             # Composants réutilisables  
data/                   # Base SQLite + types TypeScript  
constants/              # Couleurs, espacements, polices  
```

## JSON Format (import / export)

```json
[
  {
    "title": "Gâteau au chocolat",
    "time": 30,
    "type": "Dessert",
    "regime": "Standard",
    "ingredients": [
      { "name": "chocolat", "quantity": 200, "unit": "g" },
      { "name": "farine",   "quantity": 1,   "unit": "cs" }
    ],
    "steps": [
      { "order": 1, "value": "Préchauffer le four à 180°C." },
      { "order": 2, "value": "Faire fondre le chocolat avec le beurre." }
    ]
  }
]
```

## UI & Design

The visual side of things isn't really finished, and honestly it might never be, because I'm not good in design and forcing myself to keep working on that when I know it doesn't look great isn't great for morale.


Please, remember to not judge me to hard, thank you
