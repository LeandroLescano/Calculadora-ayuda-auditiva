export default function MathSolver() {
  this.infixToPostfix = function (infix) {
    var outputQueue = '';
    var operatorStack = [];
    var operators = {
      '^': {
        precedence: 4,
        associativity: 'Right',
      },
      '/': {
        precedence: 3,
        associativity: 'Left',
      },
      '*': {
        precedence: 3,
        associativity: 'Left',
      },
      '+': {
        precedence: 2,
        associativity: 'Left',
      },
      '-': {
        precedence: 2,
        associativity: 'Left',
      },
      '√': {
        precedence: 4,
        associativity: 'Right',
      },
      lg: {
        precedence: 4,
        associativity: 'Right',
      },
      ln: {
        precedence: 4,
        associativity: 'Right',
      },
      tan: {
        precedence: 4,
        associativity: 'Right',
      },
      sin: {
        precedence: 4,
        associativity: 'Right',
      },
      cos: {
        precedence: 4,
        associativity: 'Right',
      },
      arctan: {
        precedence: 4,
        associativity: 'Right',
      },
      arcsin: {
        precedence: 4,
        associativity: 'Right',
      },
      arccos: {
        precedence: 4,
        associativity: 'Right',
      },
    };
    infix = infix.replace(/\)\(/g, ')*(').replace(/(?<=\))(?=\d)/g, '*');
    infix = infix.replace(/\s+/g, '');
    // eslint-disable-next-line no-useless-escape
    infix = infix.split(/([\+\-\*\/\^\(\)\√])/);
    console.log(infix);
    for (var i = 0; i < infix.length; i++) {
      var token = infix[i];
      if (!isNaN(token) || token === 'π') {
        outputQueue += token + ' ';
      } else if (
        '^*/+-lglntansincosarctanarcsinarccos√'.indexOf(token) !== -1
      ) {
        var o1 = token;
        var o2 = operatorStack[operatorStack.length - 1];
        while (
          '^*/+-lglntansincosarctanarcsinarccos√'.indexOf(o2) !== -1 &&
          ((operators[o1].associativity === 'Left' &&
            operators[o1].precedence <= operators[o2].precedence) ||
            (operators[o1].associativity === 'Right' &&
              operators[o1].precedence < operators[o2].precedence))
        ) {
          outputQueue += operatorStack.pop() + ' ';
          o2 = operatorStack[operatorStack.length - 1];
        }
        operatorStack.push(o1);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (
          operatorStack[operatorStack.length - 1] !== '(' &&
          operatorStack.length > 0
        ) {
          outputQueue += operatorStack.pop() + ' ';
        }
        operatorStack.pop();
      }
    }
    while (operatorStack.length > 0) {
      outputQueue += operatorStack.pop() + ' ';
    }
    return outputQueue.replace(/ {3}/g, ' ').replace(/ {2}/g, ' ').trim();
  };

  this.resolveRPN = function (operation) {
    console.log(operation);
    let aux = [];
    for (let i = 0; i < operation.length; i++) {
      if (
        (!isNaN(operation[i]) && isFinite(operation[i])) ||
        operation[i] === 'π'
      ) {
        if (operation[i] === 'π') {
          aux.push(Math.PI);
        } else {
          aux.push(operation[i]);
        }
      } else {
        let a = aux.pop();
        let b = aux.pop();
        switch (operation[i]) {
          case '*':
            aux.push(a * Number(b));
            break;
          case '/':
            aux.push(Number(b) / a);
            break;
          case '+':
            aux.push(a + Number(b));
            break;
          case '-':
            if (b === undefined) {
              aux.push(a * -1);
            } else {
              aux.push(Number(b) - a);
            }
            break;
          case '^':
            aux.push(Math.pow(Number(b), a));
            break;
          case '√':
            aux.push(Math.sqrt(Number(a)));
            break;
          case 'lg':
            aux.push(Math.log10(a));
            break;
          case 'ln':
            aux.push(Math.log(a));
            break;
          case 'lg':
            aux.push(Math.log10(a));
            break;
          case 'tan':
            aux.push(Math.tan(a));
            break;
          case 'sin':
            aux.push(Math.sin(a));
            break;
          case 'cos':
            aux.push(Math.cos(a));
            break;
          case 'arctan':
            aux.push(Math.atan(a));
            break;
          case 'arcsin':
            aux.push(Math.asin(a));
            break;
          case 'arccos':
            aux.push(Math.acos(a));
            break;
        }
      }
    }
    return aux;
  };

  this.addToOperation = function (
    input,
    operation,
    cursorPos,
    operationInput,
    firstZero,
  ) {
    let localOperation = operation;
    let localCursorPos = cursorPos;
    let localFirstZero = firstZero;
    if (operation === '0' && !firstZero && input !== '0') {
      operation = '';
    }
    if (input === 'AC') {
      localOperation = '0';
      localFirstZero = false;
      localCursorPos = localOperation.length;
    }
    // DELETE ONE DIGIT
    else if (input === 'DEL') {
      if (operation.length > 0) {
        localOperation =
          operation.slice(0, cursorPos - 1) + operation.slice(cursorPos);
        localCursorPos = cursorPos - 1;
      }
    }
    // DIVIDE LAST NUMBER BY 100
    else if (input === '%') {
      let opActual = operation.slice(0, cursorPos);
      let ultPos = 0;
      for (let x = 0; x < opActual.length; x++) {
        let charCode = opActual.charCodeAt(x);
        if (charCode !== 46 && (charCode < 48 || charCode > 57)) {
          ultPos = x + 1;
        }
      }
      if (!isNaN(opActual.slice(ultPos)) && opActual.slice(ultPos) !== '') {
        let numFloat = opActual.slice(ultPos) / 100;
        let posNum = operation.lastIndexOf(opActual.slice(ultPos));
        let endOperation = operation.slice(
          posNum + opActual.slice(ultPos).length,
        );
        let newOperation = operation.slice(0, posNum) + numFloat + endOperation;
        localOperation = newOperation;
        localCursorPos =
          newOperation.lastIndexOf(numFloat) + numFloat.toString().length;
      }
    }
    // ADD BASE 10 LOGARITHM AND NATURAL LOGARITHM
    else if (['Lg', 'Ln'].indexOf(input) >= 0) {
      localOperation =
        operation.slice(0, cursorPos) +
        input.toLowerCase() +
        '()' +
        operation.slice(cursorPos);
      localCursorPos = cursorPos + 2;
    }
    // ADD TANGENT, COSENO AND SENO
    else if (['Cos', 'Tan', 'Sin'].indexOf(input) >= 0) {
      localOperation =
        operation.slice(0, cursorPos) +
        input.toLowerCase() +
        '()' +
        operation.slice(cursorPos);
      localCursorPos = cursorPos + 3;
    }
    // ADD TANGENT, COSENO AND SENO (INVERSE)
    else if (['Cos-1', 'Tan-1', 'Sin-1'].indexOf(input) >= 0) {
      localOperation =
        operation.slice(0, cursorPos) +
        'arc' +
        input.slice(0, 3).toLowerCase() +
        '()' +
        operation.slice(cursorPos);
      localCursorPos = cursorPos + 6;
    }
    // MOVE CURSOR TO RIGHT
    else if (input === 'rgt') {
      if (cursorPos + 1 <= operation.length) {
        localCursorPos = cursorPos + 1;
      }
    }
    // MOVE CURSOR TO LEFT
    else if (input === 'lft') {
      if (cursorPos - 1 >= 0) {
        localCursorPos = cursorPos - 1;
      }
    }
    // ADD DIGIT TO OPERATION
    else {
      if (input === 'X^') {
        input = '^';
      }
      if (
        '+-x/'.indexOf(input) >= 0 &&
        '+-x/'.indexOf(operation[operation.length - 1]) >= 0
      ) {
        localOperation = operation.slice(0, -1) + input;
        localCursorPos = localOperation.length;
      } else if (operation === '0' && !firstZero) {
        if ('/x)^'.indexOf(input) === -1) {
          if (!operationInput.current.isFocused()) {
            operationInput.current.focus();
          }
          localOperation = input;
          if (input === '0') {
            localFirstZero = true;
          }
        }
      } else {
        localOperation = operation + input;
        localCursorPos = localOperation.length;
      }
      if (cursorPos === localOperation.length) {
      } else {
        localOperation =
          operation.slice(0, cursorPos) + input + operation.slice(cursorPos);
        localCursorPos = cursorPos + 1;
      }
    }
    return [localOperation, localCursorPos, localFirstZero];
  };

  this.resolveAdvanced = function (operation) {
    let localOperation = operation + '';
    let split = localOperation.split(
      /(?<=[\d.])(?=[^\d.])|(?<=[^\d.-])(?=[\d.-])|(?<=[+x\/])(?=[^+x\/])|(?<=[^+x\/])(?=[+x\/])/g,
    );
    console.log(split);
    return localOperation;
  };
}
