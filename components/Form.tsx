import { Colors, Radius, Spacing } from "@/constants";
import { emptyIngredient, Ingredient, RECIPE_REGIMES, RECIPE_TYPES, RecipeInput, RecipeRegime, RecipeType, UNITS } from "@/data/types";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Card } from "./Card";
import { Chip } from "./Chip";
import { Row } from "./Row";
import { ThemedText } from "./ThemedText";


type Props = {
    recipe?: Partial<RecipeInput>,
    onSubmit: (payload: RecipeInput) => Promise<void>,
    submitLabel?: string,
}

export default function Form({recipe ={}, onSubmit, submitLabel = 'Enregistrer'}: Props) {

    const [title, setTitle] = useState(recipe?.title || '')
    const [time, setTime] = useState(String(recipe?.time || ''))
    const [type, setType] = useState<RecipeType>(recipe?.type || 'Plat')
    const [regime, setRegime] = useState<RecipeRegime>(recipe?.regime || 'Standard')
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        recipe.ingredients?.length ? recipe.ingredients : [emptyIngredient()]
    );
    const [steps, setSteps] = useState<string[]>(recipe?.steps?.length ? recipe.steps : [''])


    const addIngredient = () => {
        setIngredients((prev) => [...prev, emptyIngredient()])
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

        await onSubmit({
            title: title.trim(),
            time: parseInt(time) || 30,
            type,
            regime,
            ingredients: validIngredients.map(i => ({
                name: i.name.trim(),
                quantity: Number(i.quantity) || 0,
                unit: i.unit.trim(),
            })),
            steps: steps.filter(s => s.trim()),
        });
        
    };

  return (
    <Card style={styles.container}>
        {/*------------------------------------------------ Titre ------------------------------------------------------*/}
        <ThemedText variant="bodyStrong">Titre</ThemedText>
        <TextInput value={title} onChangeText={setTitle} placeholder="Titre de la recette" style={[styles.input, {backgroundColor: Colors.vanilla}]} />

        {/*----------------------------------------- Temps de préparation ----------------------------------------------*/}
        <ThemedText variant="bodyStrong">Temps de préparation en minutes</ThemedText>
        <TextInput value={time.toString()} onChangeText={setTime} placeholder="30" style={[styles.input, {backgroundColor: Colors.vanilla}]} keyboardType="numeric"/>    

        {/*-------------------------------------------- Type et régime -------------------------------------------------*/}
        <ThemedText variant="bodyStrong">Type de la recette</ThemedText>
        <FlatList 
            horizontal 
            data={RECIPE_TYPES} 
            contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
            renderItem={({item}) => 
                <Pressable onPress={() => setType(item)}>
                    <Chip name={item} active={type === item} colorActive={Colors.peach} colorBorder={Colors.orange} />
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
                    <Chip name={item} active={regime === item} colorActive={Colors.peach} colorBorder={Colors.orange} />
                </Pressable>} 
            keyExtractor={(item)=> item} 
        />
        {/*----------------------------------------------- Ingrédients -------------------------------------------------*/}
        <Card style={styles.ingredients}>
            <ThemedText variant="header2">✿ Liste des ingrédients</ThemedText>
                {ingredients.map((ingredient, index) => (
                    <Row key={index} gap={Spacing.sm}>
                        <ThemedText variant="body" color={Colors.lavander}>✦</ThemedText>
                        <TextInput 
                            value={ingredient.quantity === 0 ? '' : String(ingredient.quantity)} 
                            onChangeText={(text) => updateIngredient(index, 'quantity', text === '' ? 0 : parseFloat(text) || 0)}
                            placeholder="Quantité" 
                            style={[styles.input, {backgroundColor: Colors.vanilla, flex: 1}]}
                            keyboardType="numeric" />
                        <View style={styles.picker}>
                            <Picker 
                                selectedValue={ingredient.unit}
                                onValueChange={(text) => updateIngredient(index, 'unit', text)}
                                style={[styles.inputUnit]}
                                dropdownIconColor={Colors.green}
                                >
                                {UNITS.map((u) => (
                                    <Picker.Item key={u} label={u} value={u} />
                                ))}
                            </Picker>
                        </View>
                        <TextInput 
                            value={ingredient.name} 
                            onChangeText={(text) => updateIngredient(index, 'name', text)}
                            placeholder={`Ingrédient ${index + 1}`} 
                            style={[styles.input, {backgroundColor: Colors.vanilla, flex: 1}]} />
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
                <ThemedText variant="bodyStrong">+ Ajouter un ingrédient</ThemedText>
            </Pressable>
        </Card>
        {/*----------------------------------------- Etapes de préparation ----------------------------------------------*/}
        <Card style={styles.steps}>
            <ThemedText variant="header2">✿ Etapes de préparation</ThemedText>
                {steps.map((step, index) => (
                    <Row key={index} gap={Spacing.sm}>
                        <View style={styles.stepCircle}>
                            <ThemedText variant="small">{index + 1}</ThemedText>
                        </View>
                        <TextInput 
                            value={step}
                            onChangeText={(text) => updateStep(index, text)}
                            placeholder={`Étape ${index + 1}`}
                            style={[styles.input, {backgroundColor: Colors.vanilla, flex: 1}]}
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
                <ThemedText variant="bodyStrong">+ Ajouter une étape</ThemedText>
            </Pressable> 
        </Card>

        <Pressable onPress={handleSubmit}>
            <View style={styles.buttonSave}>
                <ThemedText variant="bodyStrong">{submitLabel}</ThemedText>
            </View>
        </Pressable> 
    </Card>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.sm,
    },
    input: {
        borderColor: Colors.orange,
        borderWidth: 1,
        borderRadius: 8,
        height: 50,
        backgroundColor: Colors.vanilla,
        flex: 1,
    },
    picker: {
        borderWidth: 1,
        borderColor: Colors.mint,
        borderRadius: 8, 
        overflow: 'hidden',
        width: 80,
        height: 50,
    },
    inputUnit: {
        backgroundColor: Colors.vanilla,
        width: '100%',
    },
    buttonRemove: {
        padding: 8,
        backgroundColor: Colors.peach,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 4,
    },
    buttonSave: {
        marginTop: 16,
        padding: 12,
        backgroundColor: Colors.peach,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircle: {
        width: Spacing.xl, 
            height: Spacing.xl, 
            borderRadius: Radius.full,
            backgroundColor: Colors.lavander,
            alignItems: 'center', 
            justifyContent: 'center'
    },
    ingrDot: {
        width: 6, 
        height: 6, 
        borderRadius: 999,
        backgroundColor: '#ffd33d',
    },
    ingredients: {
        gap: Spacing.md,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: Colors.orange,
        paddingBottom: Spacing.lg,
        paddingTop: Spacing.lg,
        marginTop: Spacing.lg,
    },
    steps: {
        gap: Spacing.md,
        flex: 1,
    },
})