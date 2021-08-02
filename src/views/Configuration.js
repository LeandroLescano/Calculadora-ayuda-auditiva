import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PickerList from '../components/PickerList';
import ManagerDB from '../functions/ManagerDB';

function Configuration() {
  const [config, setConfig] = useState({
    fontSize: 48,
    fontFamily: 'normal',
    textColor: 'white',
    buttonColor: '#1a1a1a',
    vibration: 'ALWAYS',
    sound: 'ALWAYS',
  });
  const DB = useMemo(() => new ManagerDB(), []);

  const options = {
    sizeList: [16, 24, 32, 40, 48],
    familyList: [
      {label: 'Roboto', value: 'roboto'},
      {label: 'Monospace', value: 'monospace'},
      {label: 'Serif', value: 'serif'},
      {label: 'Sans serif', value: 'sans-serif'},
      {label: 'Sans serif thin', value: 'sans-serif-thin'},
    ],
    colorList: [
      {label: 'Rojo', value: 'red'},
      {label: 'Azul', value: 'blue'},
      {label: 'Amarillo', value: 'yellow'},
      {label: 'Blanco', value: 'white'},
      {label: 'Negro', value: '#1a1a1a'},
    ],
    // stateList: ['Siempre', 'Solo resultados', 'Solo errores', 'Nunca'],
    stateList: {
      ALWAYS: 'Siempre',
      ONLY_RESULTS: 'Solo resultados',
      ONLY_ERRORS: 'Solo errores',
      NEVER: 'Nunca',
    },
  };

  const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    button: {
      backgroundColor: config.buttonColor,
      padding: 10,
    },
    buttonText: {
      fontSize: 32,
      color: config.textColor,
      fontFamily: config.fontFamily,
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      marginTop: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      marginBottom: 5,
      fontWeight: 'bold',
    },
    pickerContainer: {
      borderRadius: 10,
      borderColor: '#1a1a1a',
      borderWidth: 2,
      marginBottom: 2,
    },
    picker: {
      marginVertical: -10,
      color: 'black',
    },
    pickerText: {
      fontSize: 24,
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      DB.getConfig().then(configDB => {
        if (configDB !== null) {
          setConfig(configDB);
        }
      });
    }, [DB]),
  );

  const showToast = (
    txt = 'El color del texto y el botón deben ser distintos',
  ) => {
    ToastAndroid.show(txt, ToastAndroid.SHORT);
  };

  const saveConfiguration = async () => {
    try {
      await AsyncStorage.setItem('configuration', JSON.stringify(config));
      showToast('Configuración guardada correctamente!');
    } catch (e) {
      console.error(e);
      showToast('Ha ocurrido un error, intenteló nuevamente');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <PickerList
        styles={styles}
        title="Tamaño del texto"
        value={config.fontSize}
        data={options.sizeList}
        updateConfig={val => setConfig({...config, fontSize: val})}
      />
      <PickerList
        styles={styles}
        title="Tipografía del texto"
        value={config.fontFamily}
        data={options.familyList}
        updateConfig={val => setConfig({...config, fontFamily: val})}
      />
      <PickerList
        styles={styles}
        title="Color del texto"
        value={config.textColor}
        data={options.colorList}
        updateConfig={val => {
          if (val !== config.buttonColor) {
            setConfig({...config, textColor: val});
          } else {
            showToast();
          }
        }}
      />
      <PickerList
        styles={styles}
        title="Color de los botones"
        value={config.buttonColor}
        data={options.colorList}
        updateConfig={val => {
          if (val !== config.textColor) {
            setConfig({...config, buttonColor: val});
          } else {
            showToast();
          }
        }}
      />
      <PickerList
        styles={styles}
        title="Estado de vibración"
        value={config.vibration}
        data={options.stateList}
        updateConfig={val => setConfig({...config, vibration: val})}
      />
      <PickerList
        styles={styles}
        title="Estado de emisión de sonido"
        value={config.sound}
        data={options.stateList}
        updateConfig={val => setConfig({...config, sound: val})}
      />

      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={styles.button}
          onPress={() => saveConfiguration()}>
          <Text style={styles.buttonText}>GUARDAR</Text>
        </TouchableHighlight>
      </View>
    </ScrollView>
  );
}

export default Configuration;
