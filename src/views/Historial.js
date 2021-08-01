import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Historial({navigation}) {
  const [history, setHistory] = useState({list: []});
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 10,
      padding: 5,
      marginHorizontal: 10,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.29,
      shadowRadius: 2,
      borderRadius: 5,
      elevation: 7,
    },
    textEmpty: {
      fontSize: 25,
    },
    operation: {
      fontSize: 30,
      color: 'black',
      width: '78%',
    },
    button: {
      backgroundColor: '#1a1a1a',
    },
    buttonText: {
      fontSize: 25,
      color: 'white',
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      getHistory().then(hist => {
        if (hist !== null) {
          setHistory(hist);
        }
      });
    }, []),
  );

  const getHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('history');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  return (
    <ScrollView>
      {history.list.length > 0 ? (
        history.list.map((op, i) => {
          return (
            <View style={styles.container} key={i}>
              <Text
                style={styles.operation}
                numberOfLines={1}
                ellipsizeMode={'head'}>
                {op.operation} = {op.result}
              </Text>
              <TouchableHighlight
                style={styles.button}
                onPress={() =>
                  navigation.navigate('BÁSICA', {
                    screen: 'BÁSICA',
                    params: {
                      operationHist: op.operation,
                      resultHist: op.result,
                    },
                  })
                }>
                <Text style={styles.buttonText}>VER</Text>
              </TouchableHighlight>
            </View>
          );
        })
      ) : (
        <View style={styles.container}>
          <Text style={styles.textEmpty}>Historial de operaciones vacío.</Text>
        </View>
      )}
    </ScrollView>
  );
}

export default Historial;
