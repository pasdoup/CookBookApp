import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useRecipes } from "@/hooks/useRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function List() {
  const colors = useThemeColors()
  const { shoppingList, toggleShoppingItem, removeShoppingItem, clearList } = useRecipes();


  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.tint}]} edges={['top', 'left', 'right']}>
      <ScrollView>
        {/*------------------------ Header ------------------------*/}
        <View style={[styles.header, {backgroundColor: colors.header}]}>
          <Row gap={16}>
            <Image source={require("@/assets/images/list.png")} style={styles.logo} />
            <ThemedText variant="headline" color="text">Liste de course</ThemedText>
          </Row>
        </View>
        {/*------------------------ Body ------------------------*/}
        <View style={[styles.body]}>
          {shoppingList.length === 0 && (
            <ThemedText >La liste est vide.</ThemedText>
          )}
          {shoppingList.map((item) => (
        <View key={item.id} >
          <Pressable onPress={() => toggleShoppingItem(item.id)}>
            <ThemedText>0</ThemedText>
          </Pressable>
            <ThemedText style={{textDecorationLine: item.checked ? 'none' : 'line-through'}}>
              • {item.name} — {item.quantity} {item.unit}
            </ThemedText>
          <Pressable onPress={() => removeShoppingItem(item.id)}>
            <ThemedText>Supprimer</ThemedText>
          </Pressable>
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