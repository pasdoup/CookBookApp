
import { ButtonNewRecipe } from "@/components/ButtonNewRecipe";
import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { HeaderBorder } from "@/components/HeaderBorder";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Row } from "@/components/Row";
import { SearchBar } from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants";
import type { Recipe, RecipeRegime, RecipeType } from '@/data/types';
import { RECIPE_REGIMES, RECIPE_TYPES } from '@/data/types';
import { useRecipes } from "@/hooks/useRecipes";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet } from "react-native";
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
      {/*------------------------ Header ------------------------*/}
      <Card style={styles.header} color={Colors.bubblegum}>
        <Row gap={16}>
          <Image source={require("@/assets/images/iconBook.png")} style={styles.logo} />
          <ThemedText variant="header">Mes recettes</ThemedText>
        </Row>
        <HeaderBorder/>
      </Card>
      {/*------------------------ Search & Filters ------------------------*/}
      <Card style={[styles.search]}>
        <SearchBar value={query} onChange={setQuery} />
        <FlatList 
          horizontal 
          data={[ALL, ...RECIPE_TYPES]} 
          contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
          keyExtractor={(item)=> item} 
          renderItem={({item}) => 
            <Pressable onPress={() =>  setTypeFilter(item as RecipeType | typeof ALL)}>
              <Chip name={item} active={typeFilter === item}  colorActive={Colors.bubblegum} colorBorder={Colors.rose}/>
            </Pressable>
          } 
        />
        <FlatList 
          horizontal 
          data={[ALL, ...RECIPE_REGIMES]} 
          contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
          renderItem={({item}) => 
            <Pressable onPress={() => setRegimeFilter(item as RecipeRegime | typeof ALL)}>
              <Chip name={item} active={regimeFilter === item} colorActive={Colors.bubblegum} colorBorder={Colors.rose} />
            </Pressable>} 
          keyExtractor={(item)=> item} 
        />
      </Card>
      {/*------------------------ Body ------------------------*/}
      <Card style={[styles.body]}>
          <FlatList 
            data={results} 
            contentContainerStyle={[styles.list]}
            renderItem={({item}) => 
                <RecipeCard id={item.id} title={item.title} time={item.time} type={item.type} regime={item.regime} color={Colors.bubblegumLight} colorBorder={Colors.rose} />
            } 
            keyExtractor={(item)=> item.id.toString() }
          />
        <ButtonNewRecipe/>
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
    height: 100,
  },
  logo: {
    width: 24, 
    height: 24
  },
  search: {
    gap: Spacing.xs,
    paddingBottom: Spacing.lg
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  list: {
    gap: 8,
    padding: 12,
  },
})