import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação das telas do aplicativo
import HomeScreen from './src/screens/HomeScreen';
import SorteioNumeros from './src/screens/SorteioNumeros';
import SorteioNomes from './src/screens/SorteioNomes';

// Criação do navegador de pilha nativo
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Sorteador Divertido' }}
        />
        <Stack.Screen
          name="SorteioNumeros"
          component={SorteioNumeros}
          options={{ title: 'Sortear Números' }}
        />
        <Stack.Screen
          name="SorteioNomes"
          component={SorteioNomes}
          options={{ title: 'Sortear Nomes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
