import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { HeaderBorder } from "@/components/HeaderBorder";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants";
import { UNITS } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function List() {
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
    <SafeAreaView style={[styles.container, {backgroundColor: Colors.mint}]} edges={['top', 'left', 'right']}>
      <ScrollView style={[ {backgroundColor: Colors.cream}]}>
        {/*------------------------ Header ------------------------*/}
        <Card style={styles.header} color={Colors.mint}>
          <Row gap={16}>
            <Image source={require("@/assets/images/list.png")} style={styles.logo} />
            <ThemedText variant="header">Liste de course</ThemedText>
          </Row>
          <HeaderBorder/>
        </Card>
        {/*------------------------ Add item ------------------------*/}
      <Card >
        <Row gap={8}>
          <TextInput
              placeholder="Ingrédient"
              value={name}
              onChangeText={setName}
              style={[styles.input]}
            />
          <TextInput
            placeholder="Quantité"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={[styles.input]}
          />
          <Picker 
            selectedValue={unit}
            onValueChange={setUnit}
            placeholder="Unité"
            style={[styles.input]}>
            {UNITS.map((u) => (
              <Picker.Item key={u} label={u} value={u} style={[styles.input]}/>
            ))}
          </Picker>
          <Pressable onPress={handleAdd}>
            <View style={styles.button}>
              <ThemedText variant="bodyStrong">Ajouter</ThemedText>
            </View>
          </Pressable>
        </Row>
      </Card>
      {/* Liste */}
        <Card style={[styles.body]}>
          {shoppingList.length === 0 && (
            <EmptyState message={"La liste est vide."} />
          )}
          {shoppingList.map((item) => (
          <Card key={item.id} >
            {editId === item.id ? (
              <Row style={{ flex: 1 }}>
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

                <Pressable style={styles.button} onPress={saveEdit}>
                  <ThemedText >Enregistrer</ThemedText>
                </Pressable>
              </Row>
            ) :
            (
              <Row>
                <Pressable onPress={() => toggleShoppingItem(item.id)}>
              <View style={styles.button}>
                  <ThemedText variant="bodyStrong">O</ThemedText>
                </View>
            </Pressable>
              <ThemedText style={{textDecorationLine: item.checked===0 ? 'none' : 'line-through'}}>
                {item.name} — {item.quantity} {item.unit}
              </ThemedText>
              <Pressable onPress={() => startEdit(item)}>
                  <ThemedText style={styles.button}>Modifier</ThemedText>
                </Pressable>
            <Pressable onPress={() => removeShoppingItem(item.id)}>
              <ThemedText>Supprimer</ThemedText>
            </Pressable>
              </Row>
            )}
        </Card>
        ))}
        <View>
            {shoppingList.length > 0 && (
          <Pressable onPress={clearList}>
            <View style={styles.button}>
              <ThemedText variant="bodyStrong">Réinitialiser la liste</ThemedText>
            </View>
          </Pressable> 
            )}
        </View>
      </Card>
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
    padding: Spacing.sm,
    paddingBottom: Spacing.xl,
    height: 100,
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
    backgroundColor: Colors.mint,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    },
  noRecipe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    backgroundColor: Colors.mint,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderColor: Colors.green,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  input: {
    height: 40,
    backgroundColor: Colors.vanilla,
    borderColor: Colors.mint,
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
  },
})