import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { HeaderBorder } from "@/components/HeaderBorder";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Radius, Spacing } from "@/constants";
import { UNITS } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function List() {
  const { shoppingList, toggleShoppingItem, removeShoppingItem, clearList, addItemToShoppingList, updateShoppingItem } = useRecipes();

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

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
      {/*------------------------ Header ------------------------*/}
      <Card style={styles.header} color={Colors.mint}>
        <Row gap={16}>
          <Image source={require("@/assets/images/list.png")} style={styles.logo} />
          <ThemedText variant="header">Liste de course</ThemedText>
        </Row>
        <HeaderBorder/>
      </Card>
        {/*------------------------ Add item ------------------------*/}
        <Card>
          <Card style={styles.addItem} color={Colors.mint}>
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
              <View style={styles.picker}>
                <Picker 
                  selectedValue={unit}
                  onValueChange={setUnit}
                  style={[styles.inputUnit]}
                  dropdownIconColor={Colors.green}
                  >
                  {UNITS.map((u) => (
                    <Picker.Item key={u} label={u} value={u} />
                  ))}
                </Picker>
              </View>
            </Row>
            <Pressable android_ripple={{color: Colors.green, foreground: true}} onPress={handleAdd}>
              <View style={styles.buttonAdd}>
                <ThemedText variant="bodyStrong">Ajouter</ThemedText>
              </View>
          </Pressable>
          </Card>
        </Card>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
      {/*------------------------ Items list ------------------------*/}
        <Card style={[styles.main]}>
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

                <View style={styles.picker}>
                  <Picker 
                    selectedValue={unit}
                    onValueChange={setUnit}
                    style={[styles.inputUnit]}
                    dropdownIconColor={Colors.green}
                    >
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
              <Row style={styles.item}>
                <Row gap={Spacing.md}>
                  <Pressable onPress={() => toggleShoppingItem(item.id)}>
                    <ThemedText variant="header2" color={Colors.mint}>{item.checked===0 ? '◇' : '◆'}</ThemedText>
                  </Pressable>
                  <ThemedText style={{textDecorationLine: item.checked===0 ? 'none' : 'line-through'}}>
                    {item.name} — {item.quantity} {item.unit}
                  </ThemedText>
                </Row>
                <Row gap={Spacing.sm} >
                  <Pressable android_ripple={{color: Colors.green, foreground: true}} onPress={() => startEdit(item)}>
                  <View style={styles.button}>
                    <ThemedText >✎</ThemedText>
                  </View>
                </Pressable>
                <Pressable android_ripple={{color: Colors.green, foreground: true}} onPress={() => removeShoppingItem(item.id)}>
                  <View style={styles.button}>
                    <Ionicons name="trash-outline"/>
                  </View>
                </Pressable>
                </Row>
              </Row>
            )}
          </Card>
          ))}
          {shoppingList.length > 0 && (
            <Pressable style={styles.buttonReinit} onPress={clearList}>
              <ThemedText style={styles.buttonReinit} color={Colors.green} variant="link">✦ Réinitialiser la liste</ThemedText>
            </Pressable> 
          )}
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
  main: {
    padding: Spacing.sm,
    gap: Spacing.sm,
    flex: 1,
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
  buttonAdd: {
    padding: 8,
    backgroundColor: Colors.mint,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderColor: Colors.green,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  button: {
    padding: 8,
    backgroundColor: Colors.mint,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderColor: Colors.green,
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  buttonReinit: {
    right: 0,
  },
  input: {
    height: 50,
    backgroundColor: Colors.vanilla,
    borderColor: Colors.mint,
    borderWidth: 1,
    borderRadius: 8,
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
  addItem: {
    borderColor: Colors.green,
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    margin: Spacing.sm,
    gap: Spacing.md,
  },
  item: {
    justifyContent: 'space-between',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})