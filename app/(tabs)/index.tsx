import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { HeaderBorder } from "@/components/HeaderBorder";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Radius, Spacing } from "@/constants";
import type { Recipe, RecipeRegime, RecipeType } from '@/data/types';
import { RECIPE_REGIMES, RECIPE_TYPES } from '@/data/types';
import { useRecipes } from "@/data/useRecipes";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ALL = 'Tous';

export default function Index() {

  const { searchRecipes } = useRecipes();
  const [query,        setQuery]        = useState('');
  const [regimeFilter, setRegimeFilter] = useState<RecipeRegime | typeof ALL>(ALL);
  const [typeFilter,   setTypeFilter]   = useState<RecipeType   | typeof ALL>(ALL);
  const [results,      setResults]      = useState<Recipe[]>([]);


  const run = useCallback(async (q: string, regime: string, type: string) => {
      const res = await searchRecipes(
        q,
        regime !== ALL ? regime : undefined,
        type   !== ALL ? type   : undefined
      );
      setResults(res);
  }, [searchRecipes]);

  useEffect(() => {
     run(query, regimeFilter, typeFilter)
  }, [results, query, regimeFilter, typeFilter, run]);


  return (
    <SafeAreaView style={[styles.container, {backgroundColor: Colors.bubblegum}]} edges={['top', 'left', 'right']}>
      {/*------------------------------------------------ Header ------------------------------------------------*/}
      <Card style={styles.header} color={Colors.bubblegum}>
          <Row gap={Spacing.md}>
              <ThemedText variant="header">Mon livre de recettes</ThemedText>
              <ThemedText variant="header" color={Colors.rose}>✦ ✦</ThemedText>
          </Row>
          <ThemedText variant="bodyStrong" color={Colors.rose}>Touver une bonne recette </ThemedText>
          <HeaderBorder/>
      </Card>
      {/*------------------------------------------------ Search & Filters --------------------------------------*/}
      <Card style={[styles.search]}>
        <SearchBar value={query} onChange={setQuery} />
        <FlatList 
          horizontal 
          data={[ALL, ...RECIPE_TYPES]} 
          contentContainerStyle={{gap: Spacing.xs, paddingHorizontal: Spacing.sm}} 
          keyExtractor={(item)=> item} 
          renderItem={({item}) => 
            <Pressable onPress={() =>  setTypeFilter(item as RecipeType | typeof ALL)}>
              <Chip name={item} active={typeFilter === item}  colorActive={Colors.bubblegum} colorBorder={Colors.rose} color={Colors.bubblegumLight}/>
            </Pressable>
          } 
        />
        <FlatList 
          horizontal 
          data={[ALL, ...RECIPE_REGIMES]} 
          contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
          renderItem={({item}) => 
            <Pressable onPress={() => setRegimeFilter(item as RecipeRegime | typeof ALL)}>
              <Chip name={item} active={regimeFilter === item} colorActive={Colors.bubblegum} colorBorder={Colors.rose} color={Colors.bubblegumLight}/>
            </Pressable>} 
          keyExtractor={(item)=> item} 
        />
      </Card>
      {/*------------------------------------------------ Body -------------------------------------------------*/}
      <Card style={[styles.body]}>
          <FlatList 
            data={results} 
            contentContainerStyle={[styles.list]}
            renderItem={({item}) => 
                <RecipeCard 
                  id={item.id} 
                  title={item.title} 
                  time={item.time} 
                  type={item.type} 
                  regime={item.regime} 
                  color={Colors.bubblegumLight} 
                  colorBorder={Colors.bubblegum} />
            } 
            keyExtractor={(item)=> item.id.toString() }
          />
      </Card>
      <Card style={{padding: Spacing.xs}}>
        <Link href="/recipe/createRecipe" asChild>
            <Pressable android_ripple={{color: Colors.orange, foreground: true}} style={{borderRadius: Radius.sm}}>
                <View style={styles.buttonNew}>
                    <ThemedText variant="button" color={Colors.orange}>✦ Créer une recette</ThemedText>
                </View>
            </Pressable>   
        </Link>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.sm,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.xxxl,
    height: 175,
  },
  logo: {
    width: 50, 
    height: 50
  },
  search: {
    gap: Spacing.xs,
    paddingBottom: Spacing.lg
  },
  body: {
    flex: 1,
  },
  list: {
    gap: 8,
    padding: 12,
  },
  buttonNew: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    height: 70,
    borderRadius: Radius.lg,
    backgroundColor: Colors.peach, 
    borderColor: Colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
   
  },
})