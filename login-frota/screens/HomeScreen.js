import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen({ route }) {
  const { usuario } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo, {usuario} 👋</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold'
  }
});
