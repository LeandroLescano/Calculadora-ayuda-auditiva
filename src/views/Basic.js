import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MathSolver from '../functions/MathSolver';
import ManagerDB from '../functions/ManagerDB';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Voice from '@react-native-voice/voice';
import Recorder from '../functions/Recorder';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Basic({route, navigation}) {
  const histOperation = route.params;
  const [result, setResult] = useState('0');
  const [operation, setOperation] = useState('0');
  const [cursorPos, setCursorPos] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [firstZero, setFirstZero] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState({});
  const MathResolver = useMemo(() => new MathSolver(), []);
  const RecorderF = useMemo(() => new Recorder(), []);
  const DB = useMemo(() => new ManagerDB(), []);
  const [config, setConfig] = useState({
    fontSize: 16,
    fontFamily: 'Helvetica',
    textColor: 'white',
    buttonColor: 'black',
    vibration: 'Siempre',
    sound: 'Siempre',
  });

  const operationInput = useRef(),
    resultText = useRef();
  const symbols = [
    ['DEL', 'lft', 'rgt', 'AC'],
    ['%', '(', ')', '/'],
    ['7', '8', '9', 'x'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['M', '0', '.', '='],
  ];
  const noRepeatSymbols = ['.', '/', '-', '+', 'x'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
    },
    calculatorBasic: {
      flexDirection: 'row',
      flex: 1,
    },
    inputText: {
      flex: 1,
      textAlign: 'right',
      fontSize: 60,
    },
    layoutCalculator: {
      flex: 6,
      flexDirection: 'column',
    },
    resultText: {
      flex: 1,
      textAlign: 'right',
      fontSize: 60,
      color: showResult ? 'black' : 'grey',
      paddingRight: 2,
    },
    buttonContainer: {
      flex: 1,
    },
    button: {
      marginHorizontal: 2,
      marginVertical: 2,
      backgroundColor: config.buttonColor ?? '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
      height: '95%',
    },
    buttonText: {
      fontSize: config.fontSize ?? 70,
      fontFamily: config.fontFamily,
      color: config.textColor ?? 'white',
    },
    iconButton: {
      paddingVertical: 3,
    },
    recordingContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    textRecording: {
      fontSize: 50,
      paddingHorizontal: 10,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 25,
      backgroundColor: 'white',
    },
  });

  const onSelectionChange = ({nativeEvent: {selection, text}}) => {
    setCursorPos(selection.start);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (histOperation !== undefined) {
        setOperation(histOperation.params.operationHist);
      }
      DB.getConfig().then(configDB => {
        if (configDB !== null) {
          setConfig(configDB);
        }
      });
    }, [histOperation, DB]),
  );

  useEffect(() => {
    DB.getHistory().then(data => {
      setHistory(data);
    });
    operationInput.current.focus();
    Voice.onSpeechStart = RecorderF.onSpeechStart;
    Voice.onSpeechRecognized = RecorderF.onSpeechRecognized;
    Voice.onSpeechEnd = RecorderF.onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = RecorderF.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = RecorderF.onSpeechVolumeChanged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _startRecognizing = async () => {
    try {
      await Voice.start('es-ES');
    } catch (e) {
      console.error(e);
    }
  };

  const _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  const onSpeechResults = e => {
    let mounted = true;
    if (mounted) {
      setIsRecording(false);
      console.log('onSpeechResults: ', e);
      let operationTest = MathResolver.simplifyOperation(e.value);
      setOperation(operationTest);
    }
    return () => (mounted = false);
  };

  const onSpeechError = e => {
    console.error(e);
    setIsRecording(false);
  };

  const handleOperation = e => {
    if (
      noRepeatSymbols.indexOf(e) >= 0 &&
      operation[operation.length - 1] === e
    ) {
      return;
    }
    // SHOW RESULT
    if (e === 'M') {
      if (isRecording) {
        _stopRecognizing();
        setIsRecording(false);
      } else {
        _startRecognizing();
        setIsRecording(true);
      }
    } else if (e === '=') {
      setShowResult(true);
      saveOperation(result);
      setFirstZero(false);
    } else {
      setShowResult(false);
      let resultOp = MathResolver.addToOperation(
        e,
        operation,
        cursorPos,
        operationInput,
        firstZero,
      );
      setOperation(resultOp[0]);
      setCursorPos(resultOp[1]);
      setFirstZero(resultOp[2]);
    }
  };

  const saveOperation = async resultSave => {
    let localHistory = history;
    let repeat = false;
    localHistory.list.map(op => {
      if (op.operation === operation && op.result === result) {
        repeat = true;
        return;
      }
    });
    if (!repeat && !isNaN(result)) {
      try {
        if (localHistory.list === undefined) {
          localHistory = {list: [{operation: operation, result: resultSave}]};
        } else {
          if (Object.keys(localHistory.list).length === 10) {
            localHistory.list.pop();
          }
          localHistory.list.unshift({operation: operation, result: resultSave});
        }
        await AsyncStorage.setItem('history', JSON.stringify(localHistory));
      } catch (e) {
        console.error(e);
      }
    }
  };

  var layoutCalculator = [];

  for (let index = 0; index < 6; index++) {
    layoutCalculator.push(
      <View style={styles.calculatorBasic} key={index}>
        {symbols[index].map((item, i) => {
          return (
            <TouchableHighlight
              key={i}
              underlayColor="white"
              style={styles.buttonContainer}
              onPress={() => handleOperation(item)}>
              <View style={styles.button}>
                {item === 'lft' ? (
                  <Icon
                    name="arrow-back"
                    color={config.textColor ?? 'white'}
                    size={config.fontSize + 10}
                    style={styles.iconButton}
                  />
                ) : item === 'rgt' ? (
                  <Icon
                    name="arrow-forward"
                    color={config.textColor ?? 'white'}
                    size={config.fontSize + 10}
                    style={styles.iconButton}
                  />
                ) : item === 'M' ? (
                  <Icon
                    name="mic"
                    color={config.textColor ?? 'white'}
                    size={config.fontSize + 10}
                    style={styles.iconButton}
                  />
                ) : (
                  <Text
                    numberOfLines={1}
                    style={styles.buttonText}
                    adjustsFontSizeToFit={true}
                    allowFontScaling={true}>
                    {item.toUpperCase()}
                  </Text>
                )}
              </View>
            </TouchableHighlight>
          );
        })}
      </View>,
    );
  }

  //Calculate operation
  useEffect(() => {
    let mounted = true;
    if (operation.length > 0) {
      //Resolve advanced
      let operationBasic = MathResolver.resolveAdvanced(operation);
      var resultOp = new MathSolver()
        .infixToPostfix(operationBasic.replace(/x/g, '*'))
        .split(' ');
      // Calculate the RPN operation
      var stack = MathResolver.resolveRPN(resultOp);
      if (mounted) {
        if (!isNaN(stack[0]) && stack.length <= 1) {
          if (
            stack[0] % 1 !== 0 &&
            stack[0].toString().substr('.').length > 8
          ) {
            setResult(Number(stack[0]).toFixed(8));
          } else {
            setResult(stack[0]);
          }
          // if (isVoiceOperation) {
          //   setCursorPos(stack[0].length);
          //   setIsVoiceOperation(false);
          // }
        } else {
          setResult('Error matemático');
        }
      }
    }
    return () => (mounted = false);
  }, [operation, MathResolver, navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        scrollEnabled={false}
        style={styles.inputText}
        value={operation}
        selection={{start: cursorPos, end: cursorPos}}
        selectionColor="black"
        onSelectionChange={onSelectionChange}
        ref={operationInput}
        showSoftInputOnFocus={false}
      />
      <Text
        style={styles.resultText}
        ref={resultText}
        adjustsFontSizeToFit={true}
        numberOfLines={1}>
        {result}
      </Text>
      <View style={styles.layoutCalculator}>{layoutCalculator}</View>
      {isRecording ? (
        <View style={styles.recordingContainer}>
          <Text style={styles.textRecording}>Grabando...</Text>
        </View>
      ) : null}
    </View>
  );
}
