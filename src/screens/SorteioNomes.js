import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

const SorteioNomes = () => {
  const [novoNome, setNovoNome] = useState('');
  const [nomes, setNomes] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const validarNomes = () => {
    if (nomes.length < 2) {
      return false;
    }
    return true;
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        // Detecta agitação baseado na aceleração
        if (Math.abs(x) > 3 || Math.abs(y) > 3 || Math.abs(z) > 3) {
          if (validarNomes()) {
            realizarSorteio();
          }
        }
      })
    );
    Accelerometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, [nomes]);

  const adicionarNome = () => {
    if (novoNome.trim() === '') {
      return;
    }

    setNomes([...nomes, novoNome.trim()]);
    setNovoNome('');
  };

  const removerNome = (index) => {
    const novosNomes = nomes.filter((_, i) => i !== index);
    setNomes(novosNomes);
  };

  const realizarSorteio = () => {
    const indice = Math.floor(Math.random() * nomes.length);

    // Feedback tátil somente quando o nome é sorteado
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    setResultado(nomes[indice]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicione os nomes para o sorteio</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite um nome"
          value={novoNome}
          onChangeText={setNovoNome}
          onSubmitEditing={adicionarNome}
        />
        <TouchableOpacity style={styles.addButton} onPress={adicionarNome}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.listContainer}>
        {nomes.map((nome, index) => (
          <View key={index} style={styles.nomeItem}>
            <Text style={styles.nomeText}>{nome}</Text>
            <TouchableOpacity
              onPress={() => removerNome(index)}
              style={styles.removeButton}
            >
              <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Text style={styles.instruction}>
        Agite o celular para sortear!
      </Text>

      {resultado !== null && (
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultadoTitle}>Nome Sorteado:</Text>
          <Text style={styles.resultado}>{resultado}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
    fontSize: 16,
    elevation: 2,
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  nomeItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  nomeText: {
    flex: 1,
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#ff5252',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  instruction: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  resultadoContainer: {
    backgroundColor: '#6200ee',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
  },
  resultadoTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  resultado: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
});

export default SorteioNomes; 