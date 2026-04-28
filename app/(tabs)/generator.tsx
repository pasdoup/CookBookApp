import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { EmptyState } from "@/components/EmptyState";
import { HeaderBorder } from "@/components/HeaderBorder";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Row } from "@/components/Row";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Radius, Spacing } from "@/constants";
import { Recipe, RECIPE_REGIMES, RECIPE_TYPES, TIMES } from "@/data/types";
import { useRecipes } from "@/hooks/useRecipes";
import { useCallback, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Generator() {
  const { recipes } = useRecipes();

  const [regime,      setRegime]      = useState('Tous');
  const [type,        setType]        = useState('Tous');
  const [time,     setTime]    = useState('Toutes');
  const [result,      setResult]      = useState<Recipe | null>(null);
  const [noResult,    setNoResult]    = useState(false);
  const [history,     setHistory]     = useState<number[]>([]);
  
  const getFiltered = useCallback((): Recipe[] => {
    let list = recipes;
    if (regime !== 'Tous') list = list.filter(r => r.regime === regime);
    if (type   !== 'Tous') list = list.filter(r => r.type   === type);
    if (time   !== 'Toutes') list = list.filter(r => r.time   <= Number(time));
    return list;
  }, [recipes, regime, type, time]);

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


  
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: Colors.lavander}]} edges={['top', 'left', 'right']}>
    {/*------------------------ Header ------------------------*/}
    <Card style={styles.header} color={Colors.lavander}>
      <Row gap={16}>
        <Image source={require("@/assets/images/dice.png")} style={styles.logo} />
        <ThemedText variant="header">Besoin d'une idée ?</ThemedText>
      </Row>
      <HeaderBorder/>
    </Card>
    {/*------------------------ Filters ------------------------*/}
    <Card style={[styles.search]}>
      <ThemedText>Type de la recette</ThemedText>
      <FlatList 
        horizontal 
        data={['Tous', ...RECIPE_TYPES]} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item}
        renderItem={({item}) => 
          <Pressable onPress={() => {setType(item); resetFilter();}}><Chip name={item} active={type === item} colorActive={Colors.lavander} colorBorder={Colors.purple} /></Pressable>} 
        />
      <ThemedText>Régime de la recette</ThemedText>
      <FlatList 
        horizontal 
        data={['Tous', ...RECIPE_REGIMES]} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item} 
        renderItem={({item}) => 
          <Pressable onPress={() => { setRegime(item); resetFilter(); }}><Chip name={item} active={regime === item} colorActive={Colors.lavander} colorBorder={Colors.purple} /></Pressable>} 
        />
      <ThemedText>Durée de la recette</ThemedText>
      <FlatList 
        horizontal 
        data={TIMES} 
        contentContainerStyle={{gap: 8, paddingHorizontal: 12}} 
        keyExtractor={(item)=> item} 
        renderItem={({item}) => 
          <Pressable onPress={() => { setTime(item); resetFilter(); }}><Chip name={`<= ${item}`} active={time === item} colorActive={Colors.lavander} colorBorder={Colors.purple} /></Pressable>} 
      />
    </Card>
    {/*------------------------ Body ------------------------*/}
    <Card style={[styles.body]}>
      <Card>
      <Pressable onPress={draw} android_ripple={{color: Colors.purple, foreground: true}} >
        <View style={styles.buttonSave}>
            <ThemedText variant="button" color={Colors.purple}>Trouver une recette</ThemedText>
        </View>
      </Pressable> 
    </Card>

      {noResult && (
        <View style={styles.noRecipe}>
          <EmptyState message="Aucune recette trouvé"></EmptyState>
        </View>
      )}

      {result && (
        <RecipeCard 
            id={result.id}
            title={result.title}
            time={result.time}
            regime={result.regime}
            type={result.type}
            style={{ height: 'auto', minHeight: 80, }} 
            color={Colors.lavanderLight} 
            colorBorder={Colors.purple} />
          
        )}
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
  noRecipe: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSave: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderBottomWidth: 5,
    left: '25%',
    borderColor: Colors.purple,
    backgroundColor: Colors.lavander,
    height: 75,
    width: 200,
  },
  pressSave: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    height: 75,
    width: 200,
    borderColor: Colors.purple,
    backgroundColor: Colors.lavander,
  },
})
