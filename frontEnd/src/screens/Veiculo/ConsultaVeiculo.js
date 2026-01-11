import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import styles from '../../styles/consultaVeiculoStyles';

export default function ConsultaVeiculo() {
  const [placa, setPlaca] = useState('');
  const [veiculo, setVeiculo] = useState(null);
  const [erro, setErro] = useState('');

  async function consultarVeiculo() {
    setErro('');
    setVeiculo(null);

    if (!placa) {
      setErro('Informe a placa do veículo');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/consulta-veiculo/${placa}`);
      const data = await response.json();

      if (data.erro) {
        setErro(data.erro);
      } else {
        setVeiculo(data);
      }
    } catch (e) {
      setErro('Erro ao consultar veículo');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Consulta de Veículo</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a placa (ex: FVV1985)"
        autoCapitalize="characters"
        value={placa}
        onChangeText={setPlaca}
      />

      <TouchableOpacity style={styles.botao} onPress={consultarVeiculo}>
        <Text style={styles.botaoTexto}>Consultar</Text>
      </TouchableOpacity>

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      {veiculo && (
        <View style={styles.card}>
          <Text>Placa: {veiculo.placa}</Text>
          <Text>Marca: {veiculo.marca}</Text>
          <Text>Modelo: {veiculo.modelo}</Text>
          <Text>Ano: {veiculo.ano}</Text>
          <Text>Cor: {veiculo.cor}</Text>
        </View>
      )}
    </ScrollView>
  );
}
