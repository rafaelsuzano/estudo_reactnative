import { View, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen({ route, navigation }) {
  const { usuario } = route.params || {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Text>Abrir Menu</Text>
      </TouchableOpacity>

      <Text style={{ fontSize: 18, marginTop: 20 }}>
        Bem-vindo, {usuario} 👋
      </Text>
    </View>
  );
}
