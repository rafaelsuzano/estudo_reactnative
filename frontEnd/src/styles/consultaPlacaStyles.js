import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  subtitulo: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  botao: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  botaoDesabilitado: {
    backgroundColor: '#ccc',
  },
  botaoTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  erroContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  erro: {
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: 14,
  },
  erroDetalhes: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 8,
    fontFamily: 'monospace',
  },
  card: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
    fontSize: 14,
  },
  value: {
    color: '#555',
    fontSize: 14,
    lineHeight: 20,
  },
  valueContainer: {
    paddingLeft: 6,
  },
  arrayItem: {
    padding: 8,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  objectItem: {
    marginVertical: 4,
    paddingLeft: 10,
  },
  objectKey: {
    fontWeight: '600',
    color: '#444',
    fontSize: 13,
  },
  objectValue: {
    paddingLeft: 10,
    marginTop: 2,
  },
});
