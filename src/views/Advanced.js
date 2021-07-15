import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import MathSolver from '../functions/MathSolver';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Recorder from '../functions/Recorder';
import VoiceHelper from '../functions/VoiceHelper';
import ManagerDB from '../functions/ManagerDB';

export default function Basic({navigation}) {
  const [result, setResult] = useState('0');
  const [operation, setOperation] = useState('0');
  const [cursorPos, setCursorPos] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [firstZero, setFirstZero] = useState(false);
  const [isRecording, setIsRecordingAdv] = useState(false);
  const [history, setHistory] = useState({});
  const [isVoiceOperation, setIsVoiceOperation] = useState(false);
  const DB = useMemo(() => new ManagerDB(), []);
  const VoiceH = new VoiceHelper();
  // const RecorderF = useMemo(() => new Recorder(), []);
  const operationInput = useRef(),
    resultText = useRef();
  const symbolsAdv = [
    ['Tan-1', 'Sin-1', 'Cos-1', 'lft', 'rgt'],
    ['Tan', 'Sin', 'Cos', '(', ')'],
    ['Ln', 'DEL', '%', '/', 'AC'],
    ['Lg', '7', '8', '9', 'x'],
    ['X^', '4', '5', '6', '-'],
    ['√', '1', '2', '3', '+'],
    ['π', 'M', '0', '.', '='],
  ];
  const MathResolver = useMemo(() => new MathSolver(), []);
  const noRepeatSymbols = ['.', '/', '-', '+', 'x'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    calculatorBasic: {
      flexDirection: 'row',
      flex: 1,
    },
    layoutCalculator: {
      flex: 6,
      flexDirection: 'column',
    },
    inputText: {
      flex: 1,
      textAlign: 'right',
      fontSize: 60,
      paddingVertical: 0,
      marginTop: 2,
    },
    resultText: {
      flex: 1,
      textAlign: 'right',
      fontSize: 60,
      color: showResult ? 'black' : 'grey',
      marginBottom: 2,
      paddingRight: 2,
    },
    buttonContainer: {
      flex: 1,
    },
    buttonSm: {
      marginHorizontal: 2,
      marginVertical: 2,
      backgroundColor: '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
      height: '95%',
    },
    button: {
      marginHorizontal: 2,
      marginVertical: 2,
      backgroundColor: '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
      height: '95%',
    },
    buttonTextSm: {
      fontSize: 35,
      color: 'white',
    },
    buttonText: {
      fontSize: 70,
      color: 'white',
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

  const handleOperation = e => {
    if (
      noRepeatSymbols.indexOf(e) >= 0 &&
      operation[operation.length - 1] === e
    ) {
      return;
    }

    if (e === 'M') {
      if (isRecording) {
        // _stopRecognizing();
        setIsRecordingAdv(false);
        setIsVoiceOperation(false);
      } else {
        // _startRecognizing();
        setIsRecordingAdv(true);
        setIsVoiceOperation(true);
      }
      // SHOW RESULT
    } else if (e === '=') {
      setShowResult(true);
      DB.saveOperation(result, history, operation);
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

  useEffect(() => {
    DB.getHistory().then(data => {
      setHistory(data);
    });
    operationInput.current.focus();
    // Voice.onSpeechStart = RecorderF.onSpeechStart;
    // Voice.onSpeechRecognized = RecorderF.onSpeechRecognized;
    // Voice.onSpeechEnd = RecorderF.onSpeechEnd;
    // Voice.onSpeechError = onSpeechError;
    // Voice.onSpeechResults = onSpeechResults;
    // Voice.onSpeechPartialResults = RecorderF.onSpeechPartialResults;
    // Voice.onSpeechVolumeChanged = RecorderF.onSpeechVolumeChanged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const _startRecognizing = async () => {
  //   try {
  //     await Voice.start('es-ES');
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const _stopRecognizing = async () => {
  //   try {
  //     await Voice.stop();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // const onSpeechResults = e => {
  //   let mounted = true;
  //   setIsRecording(false);
  //   if (mounted) {
  //     console.log('onSpeechResults: ', e);
  //     let operationTest = MathResolver.simplifyOperation(e.value);
  //     if (operationTest !== false) {
  //       setOperation(operationTest);
  //     } else {
  //       ToastAndroid.showWithGravityAndOffset(
  //         'INGRESO INCORRECTO',
  //         ToastAndroid.SHORT,
  //         ToastAndroid.TOP,
  //         0,
  //         150,
  //       );
  //     }
  //   }
  //   return () => (mounted = false);
  // };

  // const onSpeechError = e => {
  //   console.error(e);
  //   let txt = 'ERROR';
  //   switch (e.error.code) {
  //     case '6': {
  //       txt = 'SIN INGRESO DE VOZ';
  //       break;
  //     }
  //     case '7': {
  //       txt = 'INGRESO INENTENDIBLE';
  //       break;
  //     }
  //   }
  //   setIsRecording(false);
  //   ToastAndroid.showWithGravityAndOffset(
  //     txt,
  //     ToastAndroid.SHORT,
  //     ToastAndroid.TOP,
  //     0,
  //     150,
  //   );
  // };

  //Calculate operation
  useEffect(() => {
    function checkTTS(r) {
      if (isVoiceOperation && operation !== '0') {
        setCursorPos(operation.length);
        VoiceH.speak('El resultado de ' + operation + ' es ' + r);
        setIsVoiceOperation(false);
      }
    }
    let mounted = true;
    if (operation.length > 0) {
      //Resolve advanced
      let operationBasic = MathResolver.resolveAdvanced(operation);
      //Operation to RPN
      var resultOp = MathResolver.infixToPostfix(
        operationBasic.replace(/x/g, '*'),
      ).split(' ');

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);

  var layoutCalculator = [];

  for (let index = 0; index < 7; index++) {
    layoutCalculator.push(
      <View style={styles.calculatorBasic} key={index}>
        {symbolsAdv[index].map((item, i) => {
          return (
            <TouchableHighlight
              key={i}
              underlayColor="white"
              style={styles.buttonContainer}
              onPress={() => handleOperation(item)}>
              <View style={index <= 1 ? styles.buttonSm : styles.button}>
                {item === 'lft' ? (
                  <Icon name="arrow-back" color="white" size={48} />
                ) : item === 'rgt' ? (
                  <Icon name="arrow-forward" color="white" size={48} />
                ) : item === 'M' ? (
                  <Icon
                    name="mic"
                    color="white"
                    size={60}
                    style={styles.iconButton}
                  />
                ) : (
                  <Text
                    numberOfLines={1}
                    style={index <= 1 ? styles.buttonTextSm : styles.buttonText}
                    adjustsFontSizeToFit={true}
                    allowFontScaling={true}>
                    {item}
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
      <Recorder
        record={isRecording}
        setIsRecording={val => setIsRecordingAdv(val)}
        setOperation={val => setOperation(val)}
        setIsVoiceOperation={val => setIsVoiceOperation(val)}
        random={555}
      />
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
      <Text style={styles.resultText} ref={resultText}>
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
