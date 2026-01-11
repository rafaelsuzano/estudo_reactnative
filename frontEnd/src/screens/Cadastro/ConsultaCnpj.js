


import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import styles from '../../styles/consultaCnpjStyles';
import { consultarCnpj } from '../../services/receitaWsService';

export default function ConsultaCnpjScreen() {
  const [cnpj, setCnpj] = useState('');
  const [dados, setDados] = useState(null);

  async function buscarCnpj() {
    try {
      const resultado = await consultarCnpj(cnpj);
      setDados(resultado);
    } catch (error) {
      alert(error.message);
    }
  }

  function renderValor(valor) {
    if (valor === null || valor === undefined) {
      return '-';
    }

    // Array (ex: qsa)
    if (Array.isArray(valor)) {
      return valor.map((item, index) => (
        <View key={index} style={styles.arrayItem}>
          {Object.entries(item).map(([k, v]) => (
            <Text key={k} style={styles.value}>
              {k}: {String(v)}
            </Text>
          ))}
        </View>
      ));
    }

    // Objeto
    if (typeof valor === 'object') {
      return Object.entries(valor).map(([k, v]) => (
        <Text key={k} style={styles.value}>
          {k}: {String(v)}
        </Text>
      ));
    }

    // Primitivo
    return String(valor);
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o CNPJ"
        value={cnpj}
        onChangeText={setCnpj}
      />

      <TouchableOpacity style={styles.button} onPress={buscarCnpj}>
        <Text style={styles.buttonText}>Consultar</Text>
      </TouchableOpacity>

      {dados && (
        <View style={styles.table}>
          {Object.entries(dados).map(([chave, valor]) => (
            <View key={chave} style={styles.row}>
              <Text style={styles.label}>{chave}</Text>
              <View style={styles.valueContainer}>
                {typeof valor === 'string' ||
                typeof valor === 'number'
                  ? <Text style={styles.value}>{valor}</Text>
                  : renderValor(valor)}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
