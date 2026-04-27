import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { UNITS } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function List() {
  const colors = useThemeColors()
  const { shoppingList, toggleShoppingItem, removeShoppingItem, clearList, addItemToShoppingList, updateShoppingItem } = useRecipes();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

    // Édition
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");

  function startEdit(item: any) {
    setEditId(item.id);
    setEditName(item.name);
    setEditQuantity(String(item.quantity));
    setEditUnit(item.unit);
  }

  async function saveEdit() {
    if (!editId) return;

    await updateShoppingItem(editId, editName, Number(editQuantity), editUnit);

    setEditId(null);
  }

  async function handleAdd() {
    if (!name.trim() || !quantity.trim()) return;

    await addItemToShoppingList(name.trim(), Number(quantity), unit.trim());
    setName("");
    setQuantity("");
    setUnit("");
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]} edges={['top', 'left', 'right']}>
      <ScrollView>
        {/*------------------------ Header ------------------------*/}
        <View style={[styles.header, {backgroundColor: colors.header}]}>
          <Row gap={16}>
            <Image source={require("@/assets/images/list.png")} style={styles.logo} />
            <ThemedText variant="header" >Liste de course</ThemedText>
          </Row>
        </View>
        {/*------------------------ Body ------------------------*/}
         {/* Formulaire d'ajout manuel */}
      <View >
        <TextInput
          placeholder="Ingrédient"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Quantité"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          style={styles.input}
        />
        <Picker 
          selectedValue={unit}
          onValueChange={setUnit}
          placeholder="Unité">
          {UNITS.map((u) => (
            <Picker.Item key={u} label={u} value={u} />
          ))}
        </Picker>
        <Pressable onPress={handleAdd}>
          <View style={styles.buttonRemove}>
            <ThemedText variant="bodyStrong">Ajouter</ThemedText>
          </View>
        </Pressable>
      </View>
      {/* Liste */}
        <View style={[styles.body]}>
          {shoppingList.length === 0 && (
            <ThemedText >La liste est vide.</ThemedText>
          )}
          {shoppingList.map((item) => (
        <View key={item.id} >
          {editId === item.id ? (
            <View style={{ flex: 1 }}>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={styles.input}
              />
              <TextInput
                value={editQuantity}
                onChangeText={setEditQuantity}
                keyboardType="numeric"
                style={styles.input}
              />

              <View >
                <Picker selectedValue={editUnit} onValueChange={setEditUnit} >
                  {UNITS.map((u) => (
                    <Picker.Item key={u} label={u} value={u} />
                  ))}
                </Picker>
              </View>

              <Pressable style={styles.buttonRemove} onPress={saveEdit}>
                <ThemedText >Enregistrer</ThemedText>
              </Pressable>
            </View>
          ) :
          (
            <View>
              <Pressable onPress={() => toggleShoppingItem(item.id)}>
            <View style={styles.buttonRemove}>
                <ThemedText variant="bodyStrong">O</ThemedText>
              </View>
          </Pressable>
            <ThemedText style={{textDecorationLine: item.checked===0 ? 'none' : 'line-through'}}>
              • {item.name} — {item.quantity} {item.unit}
            </ThemedText>
            <Pressable onPress={() => startEdit(item)}>
                <ThemedText style={styles.buttonRemove}>Modifier</ThemedText>
              </Pressable>
          <Pressable onPress={() => removeShoppingItem(item.id)}>
            <ThemedText>Supprimer</ThemedText>
          </Pressable>
            </View>
          )}
        </View>
      ))}
          
          {/* <Row gap={8}>
            <TextInput 
              value={item.quantity} 
              onChangeText={(text) => setItem({ ...item, quantity: text })}
              placeholder="Quantité"
              style={[styles.input, {backgroundColor: colors.search, flex: 1}]}
              keyboardType="numeric" 
            />
            <TextInput 
              value={item.unity} 
              onChangeText={(text) => setItem({ ...item, unity: text })} 
              placeholder="Unité" 
              style={[styles.input, {backgroundColor: colors.search, flex: 1}]} 
            />
            <TextInput 
              value={item.name} 
              onChangeText={(text) => setItem({ ...item, name: text })} 
              placeholder='item' 
              style={[styles.input, {backgroundColor: colors.search, flex: 1}]} 
            />
          </Row>
          <Pressable onPress={addItem}>
            <ThemedText variant="bodyStrong" color="header">+ Ajouter un ingrédient</ThemedText>
          </Pressable> */}
          <View>
             {shoppingList.length > 0 && (
            <Pressable onPress={clearList}>
              <View style={styles.buttonSave}>
                <ThemedText variant="bodyStrong">Réinitialiser la liste</ThemedText>
              </View>
            </Pressable> 
             )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 24, 
    height: 24
  },
  header: {
    gap: 16,
    padding: 12,
  },
  search: {
    gap: 8,
  },
  body: {
    flex: 1,
    gap: 12,
    padding: 12,
  },
  buttonSave: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.light.tint,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    },
  noRecipe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRemove: {
    padding: 8,
    backgroundColor: Colors.light.header,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  input: {
    height: 40,
    borderColor: Colors.light.text,
    borderWidth: 1,
    borderRadius: 8,
  },
})