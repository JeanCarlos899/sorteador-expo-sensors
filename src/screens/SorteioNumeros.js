import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

const SorteioNumeros = () => {
  const [numeroInicial, setNumeroInicial] = useState('');
  const [numeroFinal, setNumeroFinal] = useState('');
  const [resultado, setResultado] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const validarNumeros = () => {
    // Converte as strings para números e remove espaços em branco
    const inicio = parseInt(numeroInicial.trim());
    const fim = parseInt(numeroFinal.trim());

    // Verifica se os números são válidos
    if (isNaN(inicio) || isNaN(fim)) {
      return null;
    }

    // Compara os números após a conversão
    if (Number(inicio) >= Number(fim)) {
      return null;
    }

    return { inicio, fim };
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        const { x, y, z } = accelerometerData;
        // Detecta agitação baseado na aceleração
        if (Math.abs(x) > 3 || Math.abs(y) > 3 || Math.abs(z) > 3) {
          const numerosValidos = validarNumeros();
          if (numerosValidos) {
            realizarSorteio(numerosValidos.inicio, numerosValidos.fim);
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
  }, [numeroInicial, numeroFinal]);

  const realizarSorteio = (inicio, fim) => {
    // Gera um número aleatório entre inicio e fim
    const sorteado = Math.floor(Math.random() * (fim - inicio + 1)) + inicio;

    // Feedback tátil somente quando o número é sorteado
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    setResultado(sorteado);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Digite o intervalo para sorteio</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Número inicial"
          keyboardType="number-pad"
          value={numeroInicial}
          onChangeText={setNumeroInicial}
        />

        <TextInput
          style={styles.input}
          placeholder="Número final"
          keyboardType="number-pad"
          value={numeroFinal}
          onChangeText={setNumeroFinal}
        />
      </View>

      <Text style={styles.instruction}>
        Agite o celular para sortear!
      </Text>

      {resultado !== null && (
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultadoTitle}>Número Sorteado:</Text>
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
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    elevation: 2,
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

export default SorteioNumeros; 