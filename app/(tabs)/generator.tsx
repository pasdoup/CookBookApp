import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { EmptyState } from "@/components/EmptyState";
import { HeaderBorder } from "@/components/HeaderBorder";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Radius, Spacing } from "@/constants";
import { Recipe, RECIPE_REGIMES, RECIPE_TYPES, RecipeRegime, RecipeType, TIMES } from "@/data/types";
import { useRecipes } from "@/data/useRecipes";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Generator() {
  const { recipes } = useRecipes();

  const [regimeFilters, setRegimeFilters] = useState<RecipeRegime[]>([]);
  const [typeFilters,   setTypeFilters]   = useState<RecipeType[]>([]);
  const [time,     setTime]    = useState(0);
  const [result,      setResult]      = useState<Recipe | null>(null);
  const [noResult,    setNoResult]    = useState(false);
  const [history,     setHistory]     = useState<number[]>([]);
  
  const getFiltered = useCallback((): Recipe[] => {
    let filterRecipes = recipes;
    if (regimeFilters.length > 0) filterRecipes = filterRecipes.filter(r => regimeFilters.includes(r.regime));
    if (typeFilters.length > 0) filterRecipes = filterRecipes.filter(r => typeFilters.includes(r.type));
    if (time   !== 0) filterRecipes = filterRecipes.filter(r => r.time   <= time);
    return filterRecipes;
  }, [recipes, regimeFilters, typeFilters, time]);

  const draw = useCallback(() => {
    const filtered = getFiltered();
    if (filtered.length === 0) { setResult(null); setNoResult(true); return; }

    let pool = filtered.filter(r => !history.includes(r.id));
    if (pool.length === 0) { setHistory([]); pool = filtered; }

    const picked = pool[Math.floor(Math.random() * pool.length)];
    setHistory(prev => [...prev, picked.id]);
    setResult(picked);
    setNoResult(false);

  }, [getFiltered, history]);

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  }
  function toggleTime(time: number,val: number): number {
    return time == val ? 0 : val;
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: Colors.lavander}]} edges={['top', 'left', 'right']}>
    {/*------------------------------------------------ Header ------------------------------------------------*/}
    <Card style={styles.header} color={Colors.lavander}>
        <Row gap={Spacing.md}>
            {/* <Image source={logos[logo]} style={styles.logo} /> */}
            <ThemedText variant="header">Trouver une recette ?</ThemedText>
            <ThemedText variant="header" color={Colors.purple}>✦ ✦</ThemedText>
        </Row>
        <ThemedText variant="header2" color={Colors.purple}>Besoin d'une idée pour ce soir? </ThemedText>
        <HeaderBorder/>
    </Card>
    {/*------------------------------------------------ Filters ------------------------------------------------*/}
    <Card style={[styles.search]}>
      <ThemedText>Type de la recette</ThemedText>
      <FlatList 
        horizontal 
        data={RECIPE_TYPES} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item}
        renderItem={({item}) => 
        <Pressable onPress={() => {setTypeFilters(prev => toggle(prev, item))}}>
          <Chip name={item} active={typeFilters.includes(item)} colorActive={Colors.lavander} colorBorder={Colors.purple} color={Colors.lavanderLight}/>
        </Pressable>} 
        />
      <ThemedText>Régime de la recette</ThemedText>
      <FlatList 
        horizontal 
        data={RECIPE_REGIMES} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item} 
        renderItem={({item}) => 
        <Pressable onPress={() => { setRegimeFilters(prev => toggle(prev, item))}}>
          <Chip name={item} active={regimeFilters.includes(item)} colorActive={Colors.lavander} colorBorder={Colors.purple} color={Colors.lavanderLight}/>
        </Pressable>} 
        />
      <ThemedText>Durée de la recette</ThemedText>
      <FlatList 
        horizontal 
        data={TIMES} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item) => item.toString()} 
        renderItem={({item}) => 
        <Pressable onPress={() => { setTime(prev => toggleTime(prev, item))}}>
          <Chip name={`<= ${item}`} active={time === item} colorActive={Colors.lavander} colorBorder={Colors.purple} color={Colors.lavanderLight}/>
        </Pressable>} 
      />
    </Card>
    {/*------------------------------------------------ Body -------------------------------------------------*/}
    <Card style={[styles.body]}>
      {noResult && (
        <Card style={styles.noRecipe}>
          <EmptyState message="Aucune recette trouvé"></EmptyState>
        </Card>
      )}
      {result && (
        <Card style={styles.result}>
          <RecipeCard 
                  id={result.id} 
                  title={result.title} 
                  time={result.time} 
                  type={result.type} 
                  regime={result.regime} 
                  color={Colors.lavanderLight} 
                  colorBorder={Colors.purple} />
        </Card>
        )}
        <Pressable android_ripple={{color: Colors.purple, foreground: true}} onPress={draw}>
          <View style={styles.generate}>
            <ThemedText variant="bodyStrong" color={Colors.purple}>Trouver ✦✦</ThemedText>
          </View>
        </Pressable>
      <Card>
      </Card>
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
  search: {
    gap: Spacing.xs,
    padding: Spacing.xs
  },
  body: {
    flex: 1,
    padding: Spacing.sm,
  },
  noRecipe: {
    flex: 1,
    justifyContent: 'center',
  },
  result: {
    paddingTop: Spacing.md,
    flex: 1,
  },
  generate: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
    borderColor: Colors.purple,
    backgroundColor: Colors.lavanderLight,
    height: 70,
  },
})
