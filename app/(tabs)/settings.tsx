import { Card } from "@/components/Card";
import { HeaderBorder } from "@/components/HeaderBorder";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Radius, Spacing } from "@/constants";
import { dbGetAll } from "@/data/database";
import { Ingredient, Step } from "@/data/types";
import { useRecipes } from "@/data/useRecipes";
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from "expo-sharing";
import React from "react";
import { Alert, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function Settings() {
  const { addRecipe } = useRecipes();

    async function handleExport() {
      try {
        const recipes = await dbGetAll();
        if (recipes.length === 0) {
            Alert.alert('Export', 'Aucune recette à exporter.');
            return;
        }
        const exportData = recipes.map(({ id, ...rest }) => rest);
       
        const json = JSON.stringify(exportData, null, 2)
        const file = new File(Paths.cache, 'recipes.json');
        file.write(json);

        const canShare = await Sharing.isAvailableAsync();
          if (!canShare) {
            Alert.alert('Erreur', "Le partage n'est pas disponible.");
            return;
          }
        await Sharing.shareAsync(file.uri, {
          mimeType: 'application/json',
          dialogTitle: 'Exporter mes recettes',
          UTI: 'public.json',
        });

        } catch (error) {
            console.error(error);
            Alert.alert('Erreur', "Impossible d'exporter les recettes en JSON.");
        }
    }


    async function handleImport() {
      try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) return 0;

      const picked = result.assets[0];
      const file = new File(picked.uri);
      const content = file.text();

      let parsed: unknown;
      try {
        parsed = JSON.parse(await content);
      } catch {
        Alert.alert('Format invalide', "Le fichier n'est pas un JSON valide.");
        return 0;
      }
      if (!Array.isArray(parsed)) {
        Alert.alert('Format invalide', 'Le fichier doit contenir un tableau de recettes [ ].');
        return 0;
      }

      let count = 0;
      const errors: string[] = [];
      for (const item of parsed) {
        if (typeof item !== 'object' || !item.title || !Array.isArray(item.ingredients)   || !Array.isArray(item.steps)) {
          errors.push(item?.title ?? 'recette sans titre');
          continue;
        }
        const ingredients: Ingredient[] = item.ingredients
          .map((ing: any) => ({
            name: typeof ing.name === 'string' ? ing.name.trim() : '',
            quantity: typeof ing.quantity === 'number' ? ing.quantity : 0,
            unit: typeof ing.unit === 'string' ? ing.unit.trim() : '',
          })).filter((ing: Ingredient) => ing.name !== '');

        const steps: Step[] = item.steps
          .map((s: any, index: number) => ({
            order: typeof s.order === 'number' ? s.order : index + 1,
            value: typeof s.value === 'string' ? s.value.trim() : '',
          }))
          .filter((s: Step) => s.value !== '');

        if (ingredients.length === 0 || steps.length === 0) {
          errors.push(item.title);
          continue;
        }

        const payload = {
          title:       String(item.title).trim(),
          time:        typeof item.time === 'number' ? item.time : 30,
          type:        item.type   ?? 'Plat',
          regime:      item.regime ?? 'Standard',
          ingredients,
          steps,
        };
        addRecipe(payload);
        count++;
      }

      if (errors.length > 0) {
        Alert.alert(
          `${count} recette${count > 1 ? 's' : ''} importée${count > 1 ? 's' : ''} ✦`,
          `${errors.length} ignorée${errors.length > 1 ? 's' : ''} (format invalide) :\n${errors.join(', ')}`
        );
      } else {
        Alert.alert(
          'Import réussi ✦',
          `${count} recette${count > 1 ? 's' : ''} importée${count > 1 ? 's' : ''} avec succès ♡`
        );
      }

      return count;

    } catch (e) {
      Alert.alert('Erreur import', String(e));
      return 0;
    }
  };
  

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: Colors.cream}]} edges={['top', 'left', 'right']}>
        {/*------------------------ Header ------------------------*/}
        <Card style={styles.header} color={Colors.cream}>
            <Row gap={Spacing.md}>
                <ThemedText variant="header">Paramètres</ThemedText>
                <ThemedText variant="header" color={Colors.lemon}>✦ ✦</ThemedText>
            </Row>
            <ThemedText variant="bodyStrong" color={Colors.lemon}>Importer et exporter les recettes </ThemedText>
            <HeaderBorder/>
        </Card>
        {/*------------------------ Buttons ------------------------*/}
        <Card style={styles.main}>
            <Pressable onPress={handleExport} style={styles.button} android_ripple={{color: Colors.lemon, foreground: true}}>
                <ThemedText variant="button" color={Colors.lemon}>Exporter les recettes ✦ ✦</ThemedText>
            </Pressable>
            <Pressable onPress={handleImport} style={styles.button} android_ripple={{color: Colors.lemon, foreground: true}}>
                <ThemedText variant="button" color={Colors.lemon}>✦ ✦ Importer des recettes</ThemedText>
            </Pressable>
        </Card>
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
  main: {
    flex: 1,
    padding: Spacing.sm,
    gap: Spacing.xxxl,
    justifyContent: 'center',
    alignItems: 'center',

  },
  button: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: Colors.lemon,
    backgroundColor: Colors.cream,
    height: 70,
  },

})
