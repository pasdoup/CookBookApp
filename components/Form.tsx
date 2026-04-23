import { Colors } from "@/constants/Colors";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Ingredient } from "@/types/Ingredient";
import { Recipe } from "@/types/Recipe";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Chip } from "./Chip";
import { Row } from "./Row";
import { ThemedText } from "./ThemedText";

const regimes = ['Standard', 'Végé', 'Vegan'];
const types = ['Entrée', 'Plat', 'Dessert', 'Snack', 'Boisson'];

type Props = {
    recipe?: Recipe,
    onSubmit: (value: string) => void
}

export default function Form({recipe, onSubmit}: Props) {
    const colors = useThemeColors()

    const [title, setTitle] = useState(recipe?.title || '')
    const [time, setTime] = useState(recipe?.time || '')   
    const [type, setType] = useState(recipe?.type || 'Plat')
    const [regime, setRegime] = useState(recipe?.regime || 'Standard')
    const [ingredients, setIngredients] = useState(recipe?.ingredients?.length ? recipe.ingredients : [{ quantity: '', unity: '', name: '' }])
    const [steps, setSteps] = useState(recipe?.steps?.length ? recipe.steps : [''])


    const addIngredient = () => {
        setIngredients((prev) => [...prev, { quantity: '', unity: '', name: '' }])
    }
    const removeIngredient = (id: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== id))
    }

    const addStep = () => {
        setSteps((prev) => [...prev, ''])
    }
    const removeStep = (id: number) => {
        setSteps((prev) => prev.filter((_, i) => i !== id))
    }
    const updateStep = (index: number, text: string) => {
        setSteps((prev) => prev.map((step, i) => i === index ? text : step))
    }

    const save = () => {
        if (!title.trim() || !time || ingredients.some((ing: Ingredient) => !ing.name.trim()) || steps.some((step: string) => !step.trim())) {
            alert("Veuillez remplir tous les champs.")
            return;
        }
        onSubmit(JSON.stringify({
            title,
            time,  
            type,
            regime,
            ingredients,
            steps
        }))
    }

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
            data={types} 
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
            data={regimes} 
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
                        value={ingredient.quantity} 
                        onChangeText={(text) => setIngredients((prev) => prev.map((ing, i) => i === index ? { ...ing, quantity: text } : ing))}
                        placeholder="Quantité" 
                        style={[styles.input, {backgroundColor: colors.search, flex: 1}]}
                        keyboardType="numeric" />
                    <TextInput 
                        value={ingredient.unity} 
                        onChangeText={(text) => setIngredients((prev) => prev.map((ing, i) => i === index ? { ...ing, unity: text } : ing))}
                        placeholder="Unité" 
                        style={[styles.input, {backgroundColor: colors.search, flex: 1}]} />
                    <TextInput 
                        value={ingredient.name} 
                        onChangeText={(text) => setIngredients((prev) => prev.map((ing, i) => i === index ? { ...ing, name: text } : ing))}
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

        <Pressable onPress={save}>
            <View style={styles.buttonSave}>
                <ThemedText variant="bodyStrong">Enregistrer</ThemedText>
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