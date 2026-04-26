import { Colors } from "@/constants/Colors";
import { Ingredient, RECIPE_REGIMES, RECIPE_TYPES, RecipeRegime, RecipeType } from "@/data/types";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Chip } from "./Chip";
import { Row } from "./Row";
import { ThemedText } from "./ThemedText";


type Props = {
    recipe?: Partial<RecipePayload>,
    onSubmit: (payload: RecipePayload) => Promise<void>,
    submitLabel?: string,
}

export default function Form({recipe, onSubmit, submitLabel = 'Enregistrer'}: Props) {
    const colors = useThemeColors()
    const [submitting, setSubmitting] = useState(false);

    const [title, setTitle] = useState(recipe?.title || '')
    const [time, setTime] = useState(recipe?.time || '')   
    const [type, setType] = useState<RecipeType>(recipe?.type || 'Plat')
    const [regime, setRegime] = useState<RecipeRegime>(recipe?.regime || 'Standard')
    const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients?.length ? recipe.ingredients : [{ quantity: '', unit: '', name: '' }])
    const [steps, setSteps] = useState<string[]>(recipe?.steps?.length ? recipe.steps : [''])


    const addIngredient = () => {
        setIngredients((prev) => [...prev, { name: '', quantity: '', unit: '' }])
    }
    const removeIngredient = (id: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== id))
    }
    const updateIngredient = (i: number, field: keyof Ingredient, val: string | number) =>
    setIngredients(prev => prev.map((ing, idx) => idx === i ? { ...ing, [field]: val } : ing));

    const addStep = () => {
        setSteps((prev) => [...prev, ''])
    }
    const removeStep = (id: number) => {
        setSteps((prev) => prev.filter((_, i) => i !== id))
    }
    const updateStep = (index: number, text: string) => {
        setSteps((prev) => prev.map((step, i) => i === index ? text : step))
    }

    const handleSubmit = async () => {
        if (!title.trim()) { Alert.alert('Champ requis', 'Le titre est obligatoire.'); return; }
        const validIngredients = ingredients.filter(i => i.name.trim() !== '');
        if (validIngredients.length === 0) { Alert.alert('Champ requis', 'Ajoutez au moins un ingrédient.'); return; }

        setSubmitting(true);
        try {
        await onSubmit({
            title: title.trim(),
            time:  parseInt(time) || 30,
            type,
            regime,
            ingredients: validIngredients.map(i => ({
            name:     i.name.trim(),
            quantity: Number(i.quantity) || 0,
            unit:     i.unit.trim(),
            })),
            steps: steps.filter(s => s.trim()),
        });
        } finally {
        setSubmitting(false);
        }
    };

  return (
    <View>
        {/*------------------------------------------------ Titre ------------------------------------------------------*/}
        <ThemedText variant="bodyStrong">Titre</ThemedText>
        <TextInput value={title} onChangeText={setTitle} placeholder="Titre de la recette" style={[styles.input, {backgroundColor: colors.search}]} />

        {/*----------------------------------------- Temps de préparation ----------------------------------------------*/}
        <ThemedText variant="bodyStrong">Temps de préparation en minutes</ThemedText>
        <TextInput value={time.toString()} onChangeText={setTime} placeholder="30" style={[styles.input, {backgroundColor: colors.search}]} keyboardType="numeric"/>    

        {/*-------------------------------------------- Type et régime -------------------------------------------------*/}
        <ThemedText variant="bodyStrong">Type de la recette</ThemedText>
        <FlatList 
            horizontal 
            data={RECIPE_TYPES} 
            contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
            renderItem={({item}) => 
                <Pressable onPress={() => setType(item)}>
                    <Chip name={item} active={type === item} />
                </Pressable>} 
            keyExtractor={(item)=> item} 
        />
        <ThemedText variant="bodyStrong">Régime alimentaire</ThemedText>
        <FlatList 
            horizontal 
            data={RECIPE_REGIMES} 
            contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
            renderItem={({item}) => 
                <Pressable onPress={() => setRegime(item)}>
                    <Chip name={item} active={regime === item} />
                </Pressable>} 
            keyExtractor={(item)=> item} 
        />
        {/*----------------------------------------------- Ingrédients -------------------------------------------------*/}
        <ThemedText variant="bodyStrong">Liste des ingrédients</ThemedText>
            {ingredients.map((ingredient, index) => (
                <Row key={index}>
                    <View style={styles.ingrDot} />
                    <TextInput 
                        value={ingredient.quantity === 0 ? '' : String(ingredient.quantity)} 
                        onChangeText={(text) => updateIngredient(index, 'quantity', text === '' ? 0 : parseFloat(text) || 0)}
                        placeholder="Quantité" 
                        style={[styles.input, {backgroundColor: colors.search, flex: 1}]}
                        keyboardType="numeric" />
                    <TextInput 
                        value={ingredient.unit} 
                        onChangeText={(text) => updateIngredient(index, 'unit', text)}
                        placeholder="Unité" 
                        style={[styles.input, {backgroundColor: colors.search, flex: 1}]} />
                    <TextInput 
                        value={ingredient.name} 
                        onChangeText={(text) => updateIngredient(index, 'name', text)}
                        placeholder={`Ingrédient ${index + 1}`} 
                        style={[styles.input, {backgroundColor: colors.search, flex: 1}]} />
                    {ingredients.length > 0 && (
                        <Pressable onPress={() => removeIngredient(index)}>
                            <View style={styles.buttonRemove}>
                                <ThemedText variant="bodyStrong">x</ThemedText>
                            </View>
                        </Pressable>
                    )}
                </Row>
            ))}
        <Pressable onPress={addIngredient}>
            <ThemedText variant="bodyStrong" color="header">+ Ajouter un ingrédient</ThemedText>
        </Pressable>
        {/*----------------------------------------- Etapes de préparation ----------------------------------------------*/}
        <ThemedText variant="bodyStrong">Etapes de préparation</ThemedText>
            {steps.map((step, index) => (
                <Row key={index}>
                    <View style={styles.stepCircle}>
                        <ThemedText variant="bodyStrong">{index + 1}</ThemedText>
                    </View>
                    <TextInput 
                        value={step}
                        onChangeText={(text) => updateStep(index, text)}
                        placeholder={`Étape ${index + 1}`}
                        style={[styles.input, {backgroundColor: colors.search, flex: 1}]}
                    />
                    {steps.length > 0 && (
                        <Pressable onPress={() => removeStep(index)}>
                            <View style={styles.buttonRemove}>
                                <ThemedText variant="bodyStrong">x</ThemedText>
                            </View>
                        </Pressable>
                    )}
                </Row>
            ))}
        <Pressable onPress={addStep}>
            <ThemedText variant="bodyStrong" color="header">+ Ajouter une étape</ThemedText>
        </Pressable> 

        <Pressable onPress={handleSubmit}>
            <View style={styles.buttonSave}>
                <ThemedText variant="bodyStrong">{submitting ? 'Enregistrement…' : submitLabel}</ThemedText>
            </View>
        </Pressable> 
    </View>
  );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: Colors.light.text,
        borderWidth: 1,
        borderRadius: 8,
    },
    buttonRemove: {
        padding: 8,
        backgroundColor: Colors.light.header,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
    },
    buttonSave: {
        marginTop: 16,
        padding: 12,
        backgroundColor: Colors.light.header,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircle: {
        width: 12, 
        height: 12, 
        borderRadius: 999,
        backgroundColor: '#ffd33d',
        alignItems: 'center', 
        justifyContent: 'center',
    },
    ingrDot: {
        width: 6, 
        height: 6, 
        borderRadius: 999,
        backgroundColor: '#ffd33d',
  },
})