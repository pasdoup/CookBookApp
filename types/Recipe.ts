import { Ingredient } from "./Ingredient";

export interface Recipe {
    id: number;
    title: string;
    time: number;
    type: string;
    regime: string;
    ingredients: Ingredient[];
    steps: string[];
}