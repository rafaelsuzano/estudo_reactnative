import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import styles from '../../styles/consultaPlacaStyles';
import { consultarPlaca } from '../../services/placasService';

export default function ConsultaPlaca() {
  const [placa, setPlaca] = useState('');
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function buscarPlaca() {
    setErro('');
    setDados(null);
    setCarregando(true);

    try {
      const resultado = await consultarPlaca(placa);
      setDados(resultado);
    } catch (error) {
      setErro(error.message || 'Erro ao consultar placa');
    } finally {
      setCarregando(false);
    }
  }

  function renderValor(valor) {
    if (valor === null || valor === undefined) {
      return '-';
    }

    // Array (ex: multas, débitos)
    if (Array.isArray(valor)) {
      return valor.map((item, index) => (
        <View key={index} style={styles.arrayItem}>
          {typeof item === 'object' 
            ? Object.entries(item).map(([k, v]) => (
                <Text key={k} style={styles.value}>
                  {k}: {String(v)}
                </Text>
              ))
            : <Text style={styles.value}>{String(item)}</Text>
          }
        </View>
      ));
    }

    // Objeto
    if (typeof valor === 'object') {
      return Object.entries(valor).map(([k, v]) => (
        <View key={k} style={styles.objectItem}>
          <Text style={styles.objectKey}>{k}:</Text>
          <View style={styles.objectValue}>
            {renderValor(v)}
          </View>
        </View>
      ));
    }

    // Primitivo
    return String(valor);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Consulta de Placa</Text>
      <Text style={styles.subtitulo}>Consulte informações do veículo pela placa</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a placa (ex: ABC1234)"
        autoCapitalize="characters"
        maxLength={7}
        value={placa}
        onChangeText={(text) => {
          // Remove caracteres especiais e limita a 7 caracteres
          const textoLimpo = text.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 7);
          setPlaca(textoLimpo);
        }}
      />

      <TouchableOpacity 
        style={[styles.botao, carregando && styles.botaoDesabilitado]} 
        onPress={buscarPlaca}
        disabled={carregando}
      >
        {carregando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botaoTexto}>Consultar</Text>
        )}
      </TouchableOpacity>

      {erro !== '' && (
        <View style={styles.erroContainer}>
          <Text style={styles.erro}>{erro}</Text>
        </View>
      )}

      {dados && (
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Dados do Veículo</Text>
          
          {/* Verifica se é uma mensagem de erro ou resposta inesperada */}
          {dados.erro || dados.error || (dados.message && dados.message.toLowerCase().includes('error')) ? (
            <View style={styles.erroContainer}>
              <Text style={styles.erro}>
                {dados.erro || dados.error || dados.message}
              </Text>
              {dados.detalhes && (
                <Text style={styles.erroDetalhes}>
                  {JSON.stringify(dados.detalhes, null, 2)}
                </Text>
              )}
            </View>
          ) : (() => {
            // Filtra e processa os dados
            const dadosFiltrados = Object.entries(dados).filter(([chave, valor]) => {
              // Ignora campos vazios
              if (valor === null || valor === undefined || valor === '') {
                return false;
              }
              
              // Ignora mensagens estranhas conhecidas
              if (typeof valor === 'string') {
                const valorLower = valor.toLowerCase();
                if (valorLower.includes('silence') || 
                    valorLower.includes('golden') ||
                    valorLower === 'is golden' ||
                    valorLower.trim() === '') {
                  return false;
                }
              }
              
              // Ignora campos de sistema
              if (['success', 'status', 'code'].includes(chave.toLowerCase())) {
                return false;
              }
              
              return true;
            });
            
            // Se não há dados úteis após filtrar
            if (dadosFiltrados.length === 0) {
              return (
                <View style={styles.erroContainer}>
                  <Text style={styles.erro}>
                    Nenhum dado encontrado para esta placa ou resposta inválida da API.
                  </Text>
                  <Text style={styles.erroDetalhes}>
                    Resposta recebida: {JSON.stringify(dados, null, 2)}
                  </Text>
                </View>
              );
            }
            
            // Renderiza os dados filtrados
            return dadosFiltrados.map(([chave, valor]) => (
              <View key={chave} style={styles.row}>
                <Text style={styles.label}>
                  {chave.charAt(0).toUpperCase() + chave.slice(1).replace(/_/g, ' ')}:
                </Text>
                <View style={styles.valueContainer}>
                  {typeof valor === 'string' || typeof valor === 'number' ? (
                    <Text style={styles.value}>{valor}</Text>
                  ) : (
                    renderValor(valor)
                  )}
                </View>
              </View>
            ));
          })()}
        </View>
      )}
    </ScrollView>
  );
}
