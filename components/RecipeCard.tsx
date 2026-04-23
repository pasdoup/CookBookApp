import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  time: number;
  type: string;
  regime: string;
  onPress?: () => void;
};

export default function RecipeCard({ label, time, type, regime, onPress }: Props) {

    return (
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, { backgroundColor: '#fff' }]}
          onPress={() => alert('You pressed a button.')}>
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{label}</Text>
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{time}</Text>
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{type}</Text>
          <Text style={[styles.buttonLabel, { color: '#25292e' }]}>{regime}</Text>
        </Pressable>
      </View>
    );
  }



const styles = StyleSheet.create({
  buttonContainer: {
    width: 400,
    height: 100,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    borderWidth: 0.5, 
    borderColor: '#3B2A1A', 
    borderRadius: 18 
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
