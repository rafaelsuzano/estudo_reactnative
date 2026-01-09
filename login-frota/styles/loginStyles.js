import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',     // Centraliza horizontalmente elementos com largura fixa
          // 👈 Empurra tudo para baixo, mas vamos fixar o título
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    // Ajuste de tamanho aqui:
    width: '80%',      // Ocupa 80% da largura da tela (ou use um valor fixo como 250)
    maxWidth: 300,     // Garante que em telas grandes não fique gigante
    height: 45         // Altura controlada
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Ajuste de tamanho do botão para combinar com o input:
    width: '80%',
    maxWidth: 300,
    height: 45,
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});