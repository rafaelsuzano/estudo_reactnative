import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1e88e5',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  row: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  value: {
    color: '#555',
    fontSize: 13,
  },
  valueContainer: {
    paddingLeft: 6,
  },
  arrayItem: {
    padding: 6,
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
});
