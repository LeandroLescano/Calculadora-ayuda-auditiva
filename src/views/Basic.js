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
    ['DEL', 'lft', 'rgt', 'AC'],
    ['%', '(', ')', '/'],
    ['7', '8', '9', 'x'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['M', '0', '.', '='],
  ];
  const noRepeatSymbols = ['.', '/', '-', '+', 'x'];

  const MathResolver = useMemo(() => new MathSolver(), []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch',
    },
    calculatorBasic: {
      flexDirection: 'row',
    },
    inputText: {
      flex: 1,
      textAlign: 'right',
      fontSize: 60,
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
      backgroundColor: '#1a1a1a',
      alignItems: 'center',
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
                    color="white"
                    size={60}
                    style={styles.iconButton}
                  />
                ) : item === 'rgt' ? (
                  <Icon
                    name="arrow-forward"
                    color="white"
                    size={60}
                    style={styles.iconButton}
                  />
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
                    style={styles.buttonText}
                    adjustsFontSizeToFit={true}>
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
    if (operation.length > 0) {
      var resultOp = new MathSolver()
        .infixToPostfix(operation.replace(/x/g, '*'))
        .split(' ');
      // Calculate the RPN operation
      var stack = MathResolver.resolveRPN(resultOp);
      if (!isNaN(stack[0]) && stack.length <= 1) {
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
      <Text
        style={styles.resultText}
        ref={resultText}
        adjustsFontSizeToFit={true}
        numberOfLines={1}>
        {result}
      </Text>
      {layoutCalculator}
    </View>
  );
}
