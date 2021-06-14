import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Basic from './src/views/Basic';
import Advanced from './src/views/Advanced';
import {Button, StyleSheet} from 'react-native';

const Stack = createStackNavigator();

function App() {
  const styles = StyleSheet.create({
    buttonHeader: {
      marginRight: 10,
      tintColor: 'blue',
      paddingRight: 10,
    },
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Basic"
          component={Basic}
          options={({navigation}) => ({
            headerTitle: 'Calculadora Básica',
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('Advanced')}
                title="Científica"
                color="#1a1a1a"
                style={styles.buttonHeader}
              />
            ),
          })}
        />
        <Stack.Screen
          name="Advanced"
          component={Advanced}
          options={{title: 'Calculadora Avanzada'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
