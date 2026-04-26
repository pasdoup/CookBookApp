import { Chip } from "@/components/Chip";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Recipe, RECIPE_REGIMES, RECIPE_TYPES } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useCallback, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type timeFilter = { label: string; min?: number; max?: number };

const TIMES: timeFilter[] = [
  { label: 'Toutes' },
  { label: '≤ 20 min', max: 20 },
  { label: '≤ 30 min', max: 30 },
  { label: '≤ 45 min', max: 45 },
  { label: '> 45 min', min: 45 },
];

export default function Generator() {
  const colors = useThemeColors()
  const { recipes } = useRecipes();

  const [regime,      setRegime]      = useState('Tous');
  const [type,        setType]        = useState('Tous');
  const [timeIdx,     setTimeIdx]    = useState(0);
  const [result,      setResult]      = useState<Recipe | null>(null);
  const [noResult,    setNoResult]    = useState(false);
  const [history,     setHistory]     = useState<number[]>([]);

  const [activeTypes, setActiveTypes] = useState('Tous')
  const [activeRegimes, setActiveRegimes] = useState('Tous')
  const [idRecipeId, setIdRecipeId] = useState<number | null>(null)
  
  const getFiltered = useCallback((): Recipe[] => {
    let list = recipes;
    if (regime !== 'Tous') list = list.filter(r => r.regime === regime);
    if (type   !== 'Tous') list = list.filter(r => r.type   === type);
    const d = TIMES[timeIdx];
    if (d.max !== undefined) list = list.filter(r => r.time <= d.max!);
    if (d.min !== undefined) list = list.filter(r => r.time >  d.min!);
    return list;
  }, [recipes, regime, type, timeIdx]);

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

  const resetFilter = () => { setResult(null); setNoResult(false); };
  const filteredCount = getFiltered().length;


  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors.background}]} edges={['top', 'left', 'right']}>
    {/*------------------------ Header ------------------------*/}
    <View style={[styles.header, {backgroundColor: colors.header}]}>
      <Row gap={16}>
        <Image source={require("@/assets/images/dice.png")} style={styles.logo} />
        <ThemedText variant="headline" color="text">Quoi manger ?</ThemedText>
      </Row>
    </View>
    {/*------------------------ Filters ------------------------*/}
    <View style={[styles.search]}>
      <FlatList 
        horizontal 
        data={['Tous', ...RECIPE_TYPES]} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item}
        renderItem={({item}) => 
          <Pressable onPress={() => setActiveTypes(item)}><Chip name={item} active={activeTypes === item} /></Pressable>} 
      />
      <FlatList 
        horizontal 
        data={['Tous', ...RECIPE_REGIMES]} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item} 
        renderItem={({item}) => 
          <Pressable onPress={() => setActiveRegimes(item)}><Chip name={item} active={activeRegimes === item} /></Pressable>} 
      />
    </View>
    {/*------------------------ Body ------------------------*/}
    <View style={[styles.body]}>
      <View>
      <Pressable onPress={draw}>
        <View style={styles.buttonSave}>
            <ThemedText variant="bodyStrong">Trouver une recette</ThemedText>
        </View>
      </Pressable> 
      </View>

      {noResult && (
        <View style={styles.noRecipe}>
          <ThemedText variant="body" color="text">Aucune recette trouvée avec ces filtres</ThemedText>
        </View>
      )}

      {result && (
        <RecipeCard 
          id={result.id} 
          title={result.title} 
          time={result.time} 
          regime={result.regime} 
          type={result.type} 
          style={{height: 'auto', minHeight: 80}} />
          
        )}
    </View>
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
})
