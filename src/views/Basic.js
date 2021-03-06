import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
  ToastAndroid,
  Vibration,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MathSolver from '../functions/MathSolver';
import ManagerDB from '../functions/ManagerDB';
import VoiceHelper from '../functions/VoiceHelper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Voice from '@react-native-voice/voice';
import Recorder from '../functions/Recorder';
import {ScrollView} from 'react-native-gesture-handler';

export default function Basic(props) {
  const histOperation =
    props.route !== undefined ? props.route.params : undefined;
  //States
  const [result, setResult] = useState('0');
  const [operation, setOperation] = useState('0');
  const [cursorPos, setCursorPos] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [firstZero, setFirstZero] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [history, setHistory] = useState({});
  const [isVoiceOperation, setIsVoiceOperation] = useState(false);
  const [type, setType] = useState(props.type);
  const scrollResult = useRef(null);
  //File Functions
  const MathResolver = useMemo(() => new MathSolver(), []);
  const RecorderF = useMemo(() => new Recorder(), []);
  const DB = useMemo(() => new ManagerDB(), []);
  const VoiceH = new VoiceHelper();
  const [config, setConfig] = useState({
    fontSize: 48,
    fontFamily: 'Helvetica',
    textColor: 'white',
    buttonColor: '#1a1a1a',
    vibration: 'ALWAYS',
    sound: 'ALWAYS',
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
  const symbolsAdv = [
    ['Tan-1', 'Sin-1', 'Cos-1', 'lft', 'rgt'],
    ['Tan', 'Sin', 'Cos', '(', ')'],
    ['Ln', 'DEL', '%', '/', 'AC'],
    ['Lg', '7', '8', '9', 'x'],
    ['X^', '4', '5', '6', '-'],
    ['???', '1', '2', '3', '+'],
    ['??', 'M', '0', '.', '='],
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
    buttonSm: {
      marginHorizontal: 2,
      marginVertical: 2,
      backgroundColor: config.buttonColor ?? '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
      height: '95%',
    },
    button: {
      marginHorizontal: 2,
      marginVertical: 2,
      backgroundColor: config.buttonColor ?? '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
      height: '95%',
    },
    buttonTextSm: {
      fontSize: 35,
      color: 'white',
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
    },
    containerTextRecording: {
      paddingHorizontal: 10,
      borderColor: '#1a1a1a',
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: 'white',
      paddingBottom: 5,
    },
    cancelButton: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    cancelText: {
      fontSize: 20,
    },
    cancelIcon: {
      alignSelf: 'center',
      marginRight: 5,
    },
    scrollResult: {
      height: 10,
    },
    scrollResultContainer: {
      justifyContent: 'flex-end',
      flexGrow: 1,
    },
  });

  const onSelectionChange = ({nativeEvent: {selection, text}}) => {
    setCursorPos(selection.start);
  };

  useFocusEffect(
    React.useCallback(() => {
      operationInput.current.focus();
      Voice.onSpeechResults = onSpeechResults;
      Voice.onSpeechError = onSpeechError;
      if (histOperation !== undefined && histOperation.operationHist !== null) {
        setOperation(histOperation.operationHist);
        setCursorPos(histOperation.operationHist.length);
      }
      DB.getConfig().then(configDB => {
        if (configDB !== null) {
          setConfig(configDB);
        }
      });
      DB.getHistory().then(data => {
        setHistory(data);
      });
    }, [histOperation, DB, onSpeechResults, onSpeechError]),
  );

  useEffect(() => {
    DB.getHistory().then(data => {
      setHistory(data);
    });
    DB.getConfig().then(configDB => {
      if (configDB !== null) {
        setConfig(configDB);
      }
    });
    operationInput.current.focus();
    setType(props.type);
    Voice.onSpeechStart = RecorderF.onSpeechStart;
    Voice.onSpeechRecognized = RecorderF.onSpeechRecognized;
    Voice.onSpeechEnd = RecorderF.onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = RecorderF.onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = RecorderF.onSpeechVolumeChanged;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

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

  const _destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
  };

  const onSpeechResults = React.useCallback(
    e => {
      _destroyRecognizer();
      let mounted = true;
      if (mounted) {
        setIsRecording(false);
        let operationTest = MathResolver.simplifyOperation(e.value);
        if (operationTest !== false) {
          setOperation(operationTest);
        } else {
          setIsVoiceOperation(false);
          if (['ALWAYS', 'ONLY_ERRORS'].indexOf(config.sound) >= 0) {
            VoiceH.speak('Ingreso incorrecto');
          }
          if (['ALWAYS', 'ONLY_ERRORS'].indexOf(config.vibration) >= 0) {
            Vibration.vibrate([200, 300, 200, 300]);
          }
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [MathResolver],
  );

  const onSpeechError = React.useCallback(e => {
    _destroyRecognizer();
    let mounted = true;
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
    if (mounted) {
      setIsRecording(false);
    }
    if (['ALWAYS', 'ONLY_ERRORS'].indexOf(config.sound) >= 0) {
      VoiceH.speak(txt);
    }
    if (['ALWAYS', 'ONLY_ERRORS'].indexOf(config.vibration) >= 0) {
      Vibration.vibrate([200, 300, 200, 300]);
    }
    ToastAndroid.showWithGravityAndOffset(
      txt,
      ToastAndroid.SHORT,
      ToastAndroid.TOP,
      0,
      150,
    );
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOperation = e => {
    if (histOperation !== undefined && histOperation.operationHist !== null) {
      props.navigation.setParams({operationHist: null, resultHist: null});
    }
    if (
      noRepeatSymbols.indexOf(e) >= 0 &&
      operation[operation.length - 1] === e
    ) {
      return;
    }
    if (e === 'M') {
      if (!isRecording) {
        _startRecognizing();
        setIsRecording(true);
        setIsVoiceOperation(true);
        setTimeout(() => {
          _stopRecognizing();
        }, 10000);
      }
      // SHOW RESULT
    } else if (e === '=') {
      setShowResult(true);
      DB.saveOperation(result, history, operation);
      if (['ALWAYS', 'ONLY_RESULTS'].indexOf(config.sound) >= 0) {
        VoiceH.speak('Resultado: ' + result);
      }
      if (result !== 'Error matem??tico') {
        if (['ALWAYS', 'ONLY_RESULTS'].indexOf(config.vibration) >= 0) {
          Vibration.vibrate(500);
        }
      } else {
        if (['ALWAYS', 'ONLY_ERRORS'].indexOf(config.vibration) >= 0) {
          Vibration.vibrate([200, 300, 200, 300]);
        }
      }
      setFirstZero(false);
    } else {
      setShowResult(false);
      if (['ALWAYS'].indexOf(config.sound) >= 0) {
        VoiceH.speak(e);
      }
      if (['ALWAYS'].indexOf(config.vibration) >= 0) {
        Vibration.vibrate(50);
      }
      let resultOp = MathResolver.addToOperation(
        e,
        operation,
        cursorPos,
        operationInput,
        firstZero,
      );
      try {
        setOperation(resultOp[0]);
        setCursorPos(resultOp[1]);
        setFirstZero(resultOp[2]);
      } catch (err) {
        console.error(err, resultOp);
      }
    }
  };

  const handleCancelRecognition = () => {
    try {
      Voice.cancel();
      setIsRecording(false);
    } catch (e) {
      console.log(e);
    }
  };

  //Calculate operation
  useEffect(() => {
    function checkTTS(r) {
      if (isVoiceOperation && operation !== '0') {
        setCursorPos(operation.length);
        if (
          ['ALWAYS', 'ONLY_RESULTS'].indexOf(config.sound) >= 0 &&
          !isNaN(r)
        ) {
          VoiceH.speak('El resultado de ' + operation + ' es ' + r);
          if (['ALWAYS', 'ONLY_RESULTS'].indexOf(config.vibration) >= 0) {
            Vibration.vibrate(500);
          }
        } else if (
          ['ALWAYS', 'ONLY_ERRORS'].indexOf(config.sound) >= 0 &&
          isNaN(r)
        ) {
          VoiceH.speak('El resultado de ' + operation + ' da error matem??tico');
          if (['ALWAYS', 'ONLY_ERRORS'].indexOf(config.vibration) >= 0) {
            Vibration.vibrate([200, 300, 200, 300]);
          }
        }
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
        let resultSpeak = stack[0];
        if (!isNaN(stack[0]) && stack.length <= 1) {
          if (
            stack[0] % 1 !== 0 &&
            stack[0].toString().substring(stack[0].toString().indexOf('.'))
              .length > 8
          ) {
            resultSpeak = Number(stack[0].toFixed(8)).toLocaleString('en-US');
            setResult(resultSpeak);
          } else {
            setResult(Number(stack[0]).toLocaleString('en-US'));
          }
        } else {
          setResult('Error matem??tico');
        }
        checkTTS(resultSpeak);
      }
    }
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operation]);

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

  var layoutCalculatorAdv = [];

  for (let index = 0; index < 7; index++) {
    layoutCalculatorAdv.push(
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
      <ScrollView
        horizontal={true}
        style={styles.scrollResult}
        contentContainerStyle={styles.scrollResultContainer}
        ref={scrollResult}
        onContentSizeChange={() =>
          scrollResult.current.scrollToEnd({animated: true})
        }>
        <Text
          style={styles.resultText}
          ref={resultText}
          adjustsFontSizeToFit={true}
          numberOfLines={1}>
          {result}
        </Text>
      </ScrollView>
      {type === 'basic' ? (
        <View style={styles.layoutCalculator}>{layoutCalculator}</View>
      ) : (
        <View style={styles.layoutCalculator}>{layoutCalculatorAdv}</View>
      )}
      {isRecording && (
        <View style={styles.recordingContainer}>
          <View style={styles.containerTextRecording}>
            <Text style={styles.textRecording}>Grabando...</Text>
            <TouchableHighlight
              onPress={() => handleCancelRecognition()}
              underlayColor="lightgrey"
              style={{borderRadius: 5}}>
              <View style={styles.cancelButton}>
                <Icon name="cancel" size={20} style={styles.cancelIcon} />
                <Text style={styles.cancelText}>Cancelar</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      )}
    </View>
  );
}
