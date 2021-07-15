import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MathSolver from '../functions/MathSolver';
import ManagerDB from '../functions/ManagerDB';
import VoiceHelper from '../functions/VoiceHelper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Voice from '@react-native-voice/voice';
import Recorder from '../functions/Recorder';

export default function Basic({route, navigation}) {
  const histOperation = route.params;
  const [result, setResult] = useState('0');
  const [operation, setOperation] = useState('0');
  const [cursorPos, setCursorPos] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [firstZero, setFirstZero] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState({});
  const [isVoiceOperation, setIsVoiceOperation] = useState(false);
  const MathResolver = useMemo(() => new MathSolver(), []);
  const RecorderF = useMemo(() => new Recorder(), []);
  const DB = useMemo(() => new ManagerDB(), []);
  const VoiceH = new VoiceHelper();
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
      if (operationTest !== false) {
        setOperation(operationTest);
      } else {
        setIsVoiceOperation(false);
        ToastAndroid.showWithGravityAndOffset(
          'INGRESO INCORRECTO',
          ToastAndroid.SHORT,
          ToastAndroid.TOP,
          0,
          150,
        );
      }
    }
    return () => (mounted = false);
  };

  const onSpeechError = e => {
    console.error(e);
    let txt = 'ERROR';
    switch (e.error.code) {
      case '6': {
        txt = 'SIN INGRESO DE VOZ';
        break;
      }
      case '7': {
        txt = 'INGRESO INENTENDIBLE';
        break;
      }
    }
    setIsRecording(false);
    ToastAndroid.showWithGravityAndOffset(
      txt,
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
      0,
      150,
    );
  };

  const handleOperation = e => {
    if (
      noRepeatSymbols.indexOf(e) >= 0 &&
      operation[operation.length - 1] === e
    ) {
      return;
    }
    if (e === 'M') {
      if (isRecording) {
        _stopRecognizing();
        setIsRecording(false);
        setIsVoiceOperation(false);
      } else {
        _startRecognizing();
        setIsRecording(true);
        setIsVoiceOperation(true);
      }
      // SHOW RESULT
    } else if (e === '=') {
      setShowResult(true);
      DB.saveOperation(result, history, operation);
      VoiceH.speak('Resultado: ' + result); //tts deleted
      setFirstZero(false);
    } else {
      setShowResult(false);
      VoiceH.speak(e); //tts deleted
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

  //Calculate operation
  useEffect(() => {
    function checkTTS(r) {
      if (isVoiceOperation) {
        setCursorPos(operation.length);
        VoiceH.speak('El resultado de ' + operation + ' es ' + r);
        setIsVoiceOperation(false);
      }
    }
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
          let resultSpeak = stack[0];
          if (
            stack[0] % 1 !== 0 &&
            stack[0].toString().substr('.').length > 8
          ) {
            resultSpeak = Number(stack[0]).toFixed(8);
            setResult(Number(stack[0]).toFixed(8));
          } else {
            setResult(stack[0]);
          }
          checkTTS(resultSpeak);
        } else {
          setResult('Error matemático');
        }
      }
    }
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation, MathResolver, navigation, VoiceH]);

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
        spellCheck={false}
        autoCorrect={false}
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
