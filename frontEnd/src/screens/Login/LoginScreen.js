import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import styles from '../../styles/loginStyles';
import { login } from '../../scripts/loginScript';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    const resultado = await login(usuario, senha);

    if (resultado.sucesso) {
      navigation.replace('Drawer', { usuario }); // ✅ CORRETO
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema de Gestão de Frota</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
