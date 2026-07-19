import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { HeaderBorder } from "@/components/HeaderBorder";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, FontSize, Radius, Spacing } from "@/constants";
import { UNITS } from "@/data/types";
import { useRecipes } from "@/data/useRecipes";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container]} 
    >
        {/*------------------------ Header ------------------------*/}
        <Card style={styles.header} color={Colors.mint}>
            <Row gap={Spacing.md}>
                <ThemedText variant="header">Liste de course</ThemedText>
                <ThemedText variant="header" color={Colors.green}>✦ ✦</ThemedText>
            </Row>
            <ThemedText variant="bodyStrong" color={Colors.green}>Qu'est qui faut acheter </ThemedText>
            <HeaderBorder/>
        </Card>
        {/*------------------------------------------------ Add item ------------------------------------------------*/}
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
                  itemStyle={{fontSize: FontSize.body}}
                  >
                  {UNITS.map((u) => (
                    <Picker.Item key={u} label={u} value={u} />
                  ))}
                </Picker>
              </View>
            </Row>
            <Pressable android_ripple={{color: Colors.green, foreground: true}} onPress={handleAdd} style={styles.buttonAdd}>
                <ThemedText variant="button">Ajouter</ThemedText>
            </Pressable>
          </Card>
        </Card>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {/*------------------------------------------------ Items list ------------------------------------------------*/}
          <Card style={[styles.main]}>
            {shoppingList.length === 0 && (
              <EmptyState message={"La liste est vide."} />
            )}
            {shoppingList.map((item) => (
            <Card key={item.id} >
              {editId === item.id ? (
                <Row gap={Spacing.xxs} style={{ flex: 1 }}>
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
                      itemStyle={{fontSize: FontSize.body}}
                      >
                      {UNITS.map((u) => (
                        <Picker.Item key={u} label={u} value={u} />
                      ))}
                    </Picker>
                  </View>

                  <Pressable onPress={saveEdit}>
                    <Ionicons name={'checkmark-sharp'} color={Colors.green} size={25}/>
                  </Pressable>
                </Row>
              ) :
              (
                <Row style={styles.item}>
                  <Row gap={Spacing.md}>
                    <Pressable onPress={() => toggleShoppingItem(item.id)}>
                      <ThemedText variant="header" color={Colors.green}>{item.checked===0 ? '◇' : '◆'}</ThemedText>
                    </Pressable>
                    <ThemedText variant="list" style={{textDecorationLine: item.checked===0 ? 'none' : 'line-through'}}>
                      {item.name} — {item.quantity == 0 ? '' : item.quantity} {item.unit ? item.unit : ''}
                    </ThemedText>
                  </Row>
                  <Row gap={Spacing.sm} >
                    <Pressable onPress={() => startEdit(item)}>
                      <Ionicons name={'pencil-sharp'} color={Colors.green} size={25}/>
                  </Pressable>
                  <Pressable onPress={() => removeShoppingItem(item.id)}>
                      <Ionicons name="trash-outline" color={Colors.green} size={25}/>
                  </Pressable>
                  </Row>
                </Row>
              )}
            </Card>
            ))}
            {shoppingList.length > 0 && (
              <Pressable style={styles.buttonReinit} onPress={clearList}>
                <ThemedText style={styles.buttonReinit} color={Colors.green} variant="link">- Réinitialiser la liste</ThemedText>
              </Pressable> 
            )}
          </Card>
        </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: Spacing.xxxl,
    height: 175,
  },
  search: {
    gap: 8,
  },
  main: {
    padding: Spacing.sm,
    gap: Spacing.sm,
    flex: 1,
  },
  noRecipe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAdd: {
    padding: 8,
    backgroundColor: Colors.mintLight,
    borderRadius: Radius.sm,
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
    backgroundColor: Colors.mintLight,
    borderColor: Colors.green,
    borderWidth: 1,
    borderRadius: Radius.sm,
    flex: 1,
    fontSize: FontSize.body,
  },
  picker: {
    borderWidth: 1,
    borderColor: Colors.green,
    backgroundColor: Colors.mintLight,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    width: 80,
    height: 50,
  },
  inputUnit: {
    backgroundColor: Colors.mintLight,
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
})