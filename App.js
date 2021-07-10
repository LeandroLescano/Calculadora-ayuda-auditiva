import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Basic from './src/views/Basic';
import Advanced from './src/views/Advanced';
import Configuration from './src/views/Configuration';
import Historial from './src/views/Historial';
import {Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

function App() {
  const styles = StyleSheet.create({
    buttonHeader: {
      marginRight: 10,
      tintColor: 'blue',
      paddingRight: 10,
    },
    buttonPI: {
      fontSize: 35,
      marginTop: -10,
    },
    activeButtonPI: {
      fontSize: 35,
      marginTop: -10,
      color: 'white',
    },
  });

  const config = {
    animation: 'spring',
    config: {
      stiffness: 1000,
      damping: 500,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarPosition={'top'}
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName = 'calculate';
            if (route.name === 'CIENTÍFICA') {
              return (
                <Text style={focused ? styles.activeButtonPI : styles.buttonPI}>
                  π
                </Text>
              );
            } else if (route.name === 'CONFIG.') {
              iconName = 'settings';
            } else if (route.name === 'HISTORIAL') {
              iconName = 'history';
            }
            return (
              <Icon
                name={iconName}
                size={30}
                color={focused ? 'white' : '#1a1a1a'}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: 'white',
          inactiveTintColor: 'gray',
          activeBackgroundColor: '#1a1a1a',
          labelStyle: {
            fontSize: 15,
            margin: 0,
            padding: 0,
          },
        }}>
        <Tab.Screen
          options={{
            transitionSpec: {
              open: config,
              close: config,
            },
          }}
          name="BÁSICA"
          component={Basic}
        />
        <Tab.Screen name="CIENTÍFICA" component={Advanced} />
        <Tab.Screen name="HISTORIAL" component={Historial} />
        <Tab.Screen name="CONFIG." component={Configuration} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
