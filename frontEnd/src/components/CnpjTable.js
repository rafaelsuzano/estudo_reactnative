import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a', // azul escuro moderno
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e5e7eb',
    marginBottom: 16,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#1e293b',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },

  botao: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },

  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },

  resultadoContainer: {
    backgroundColor: '#020617',
    borderRadius: 8,
    padding: 12,
  },

  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingVertical: 6,
  },

  label: {
    color: '#94a3b8',
    fontWeight: 'bold',
    width: '40%',
  },

  valor: {
    color: '#e5e7eb',
    width: '60%',
    textAlign: 'right',
  },

  subtitulo: {
    color: '#38bdf8',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },

  qsaCard: {
    backgroundColor: '#020617',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },

  qsaNome: {
    color: '#e5e7eb',
    fontWeight: 'bold',
  },

  qsaCargo: {
    color: '#94a3b8',
    fontSize: 12,
  },
});
