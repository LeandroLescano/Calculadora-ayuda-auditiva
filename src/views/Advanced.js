import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import MathSolver from '../functions/MathSolver';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Basic({navigation}) {
  const [result, setResult] = useState(0);
  const [operation, setOperation] = useState('0');
  const [cursorPos, setCursorPos] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [firstZero, setFirstZero] = useState(false);
  const operationInput = useRef(),
    resultText = useRef();
  const symbols = [
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
      minHeight: 50,
    },
    button: {
      marginHorizontal: 2,
      marginVertical: 2,
      backgroundColor: '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 67,
    },
    buttonTextSm: {
      fontSize: 35,
      color: 'white',
    },
    buttonText: {
      fontSize: 50,
      color: 'white',
    },
    iconButton: {
      paddingVertical: 3,
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
    // SHOW RESULT
    if (e === '=') {
      setShowResult(true);
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

  var layoutCalculator = [];

  for (let index = 0; index < 7; index++) {
    layoutCalculator.push(
      <View style={styles.calculatorBasic} key={index}>
        {symbols[index].map((item, i) => {
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
                    adjustsFontSizeToFit={true}>
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

  //Calculate operation
  useEffect(() => {
    if (operation.length > 0) {
      //Resolve advanced
      let operationBasic = MathResolver.resolveAdvanced(operation);
      //Operation to RPN
      var resultOp = MathResolver.infixToPostfix(
        operationBasic.replace(/x/g, '*'),
      ).split(' ');

      // Calculate the RPN operation
      var stack = MathResolver.resolveRPN(resultOp);
      if (!isNaN(stack[0]) && stack.length === 1) {
        setResult(stack[0]);
      } else {
        setResult('Error matemático');
      }
    }
  }, [operation, MathResolver]);

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
      <Text style={styles.resultText} ref={resultText}>
        {result}
      </Text>
      {layoutCalculator}
    </View>
  );
}
