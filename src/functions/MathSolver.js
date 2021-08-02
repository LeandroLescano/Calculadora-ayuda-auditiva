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
    try {
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
    } catch (e) {
      console.error(e);
    }
    while (operatorStack.length > 0) {
      outputQueue += operatorStack.pop() + ' ';
    }
    return outputQueue.replace(/ {3}/g, ' ').replace(/ {2}/g, ' ').trim();
  };

  this.resolveRPN = function (operation) {
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
        let b;
        if ('lglnarctansin'.indexOf(operation[i]) === -1) {
          b = aux.pop();
        }
        switch (operation[i]) {
          case '*':
            aux.push(Number(a) * Number(b));
            break;
          case '/':
            aux.push(Number(b) / Number(a));
            break;
          case '+':
            aux.push(Number(a) + Number(b));
            break;
          case '-':
            if (b === undefined) {
              aux.push(Number(a) * -1);
            } else {
              aux.push(Number(b) - Number(a));
            }
            break;
          case '^':
            aux.push(Math.pow(Number(b), Number(a)));
            break;
          case '√':
            aux.push(Math.sqrt(Number(a)));
            break;
          case 'lg':
            aux.push(Math.log10(Number(a)));
            break;
          case 'ln':
            aux.push(Math.log(Number(a)));
            break;
          case 'tan':
            if (a === Math.PI) {
              aux.push(0);
            } else {
              aux.push(Math.tan(Number(a)));
            }
            break;
          case 'sin':
            if (a === Math.PI) {
              aux.push(0);
            } else {
              aux.push(Math.sin(Number(a)));
            }
            break;
          case 'cos':
            aux.push(Math.cos(Number(a)));
            break;
          case 'arctan':
            aux.push(Math.atan(Number(a)));
            break;
          case 'arcsin':
            aux.push(Math.asin(Number(a)));
            break;
          case 'arccos':
            aux.push(Math.acos(Number(a)));
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
        //DELETE ONE DIGIT CLASSIC
        // localOperation =
        //   operation.slice(0, cursorPos - 1) + operation.slice(cursorPos);
        // localCursorPos = cursorPos - 1;
        // ====TEST DELETE FUNCTIONS
        let opActual = operation;
        if (opActual.length > 0 && localCursorPos > 0) {
          let posFuncion = contieneOperadores(opActual);
          if (
            posFuncion >= 0 &&
            localCursorPos >= posFuncion &&
            localCursorPos <= opActual.indexOf('(') + 1
          ) {
            if (opActual.charAt(localCursorPos) === ')') {
              localOperation = opActual
                .substring(0, posFuncion)
                .concat(opActual.substring(localCursorPos + 1));
            } else {
              localOperation = opActual
                .substring(0, posFuncion)
                .concat(opActual.substring(opActual.indexOf('(') + 1));
            }
            localCursorPos = posFuncion;
          } else {
            localOperation = opActual
              .substring(0, localCursorPos - 1)
              .concat(opActual.substring(localCursorPos));
            localCursorPos--;
          }
        }
        //CLOSE DELETE FUNCTIONS
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
      let increment = 2;
      if (localOperation !== '0') {
        increment++;
      } else if (cursorPos === 0) {
        increment++;
      }
      localOperation =
        operation.slice(0, cursorPos) +
        input.toLowerCase() +
        '()' +
        operation.slice(cursorPos);
      localCursorPos = cursorPos + increment;
    }
    // ADD TANGENT, COSENO AND SENO
    else if (['Cos', 'Tan', 'Sin'].indexOf(input) >= 0) {
      let increment = 3;
      console.log(cursorPos);
      if (localOperation !== '0') {
        increment++;
      } else if (cursorPos === 0) {
        increment++;
      }
      localOperation =
        operation.slice(0, cursorPos) +
        input.toLowerCase() +
        '()' +
        operation.slice(cursorPos);
      localCursorPos = cursorPos + increment;
    }
    // ADD TANGENT, COSENO AND SENO (INVERSE)
    else if (['Cos-1', 'Tan-1', 'Sin-1'].indexOf(input) >= 0) {
      let increment = 6;
      if (localOperation !== '0') {
        increment++;
      } else if (cursorPos === 0) {
        increment++;
      }
      localOperation =
        operation.slice(0, cursorPos) +
        'arc' +
        input.slice(0, 3).toLowerCase() +
        '()' +
        operation.slice(cursorPos);
      localCursorPos = cursorPos + increment;
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
    // let split = localOperation.split(
    //   /(?<=[\d.])(?=[^\d.])|(?<=[^\d.-])(?=[\d.-])|(?<=[+x\/])(?=[^+x\/])|(?<=[^+x\/])(?=[+x\/])/g,
    // );
    return localOperation;
  };

  this.simplifyOperation = function (speechList) {
    let textLetras = true;
    let localOperation;
    speechList.every(match => {
      textLetras = true;
      if (!soloLetras(match)) {
        textLetras = false;
      }
      if (!textLetras) {
        let opTraducida = match.toLowerCase();
        opTraducida = traducirlocalOperation(opTraducida);
        if (opTraducida != null) {
          localOperation = opTraducida.replace(' ', '');
          return false;
        }
      }
      return true;
    });
    if (localOperation !== undefined) {
      return localOperation.replace(/ /g, '');
    }
    return false;
  };

  const soloLetras = text => {
    if (text.includes(':') || text.includes('a las')) {
      return true;
    } else if (text.includes('pi')) {
      return false;
    }
    let chars = text.replace(/ /g, '').split('');
    let soloL = true;
    chars.every(c => {
      if (c.charCodeAt(0) >= 48 && c.charCodeAt(0) <= 57) {
        soloL = false;
        return false;
      }
      return true;
    });
    return soloL;
  };

  const traducirlocalOperation = opTraducida => {
    if (opTraducida.includes('menos')) {
      opTraducida = opTraducida.replace('menos', '-');
    }
    if (opTraducida.includes('más') || opTraducida.includes('mas')) {
      opTraducida = opTraducida.replace('más', '+');
      opTraducida = opTraducida.replace('mas', '+');
    }
    opTraducida = opTraducida
      .replace('--', '+')
      .replace('+-', '-')
      .replace('-+', '-')
      .replace('++', '+')
      .replace(',', '.')
      .replace('- ', '-')
      .replace('+ ', '+');
    if (opTraducida.includes('*')) {
      opTraducida = opTraducida.replace('*', 'x');
    }
    if (opTraducida.includes('por')) {
      opTraducida = opTraducida.replace('por', 'x');
    }
    if (opTraducida.includes('dividido')) {
      opTraducida = opTraducida.replace('dividido', '/');
    }
    if (opTraducida.includes('elevado a la') || opTraducida.includes('a la')) {
      opTraducida = opTraducida.replace('elevado a la', '^');
      opTraducida = opTraducida.replace('a la', '^');
    }
    if (opTraducida.includes('raíz cuadrada de')) {
      opTraducida = opTraducida.replace('raíz cuadrada de', '√');
    }
    if (
      opTraducida.includes('a el cuadrado') ||
      opTraducida.includes('al cuadrado')
    ) {
      opTraducida = opTraducida.replace('a el cuadrado', '^2');
      opTraducida = opTraducida.replace('al cuadrado', '^2');
    }
    if (opTraducida.includes('a el cubo') || opTraducida.includes('al cubo')) {
      opTraducida = opTraducida.replace('a el cubo', '^3');
      opTraducida = opTraducida.replace('al cubo', '^3');
    }
    if (opTraducida.includes('raíz de')) {
      opTraducida = opTraducida.replace('raíz de', '√');
    }
    if (opTraducida.includes('pi')) {
      opTraducida = opTraducida.replace('pi', 'π');
    }
    try {
      opTraducida = deteccionFuncion('logaritmo natural', 'ln', opTraducida);
      opTraducida = deteccionFuncion('logaritmo decimal', 'lg', opTraducida);
      opTraducida = deteccionFuncion('logaritmo', 'lg', opTraducida);
      opTraducida = deteccionFuncion('coseno inverso', 'arccos', opTraducida);
      opTraducida = deteccionFuncion('coseno', 'cos', opTraducida);
      opTraducida = deteccionFuncion('tangente inversa', 'arctan', opTraducida);
      opTraducida = deteccionFuncion('tangente', 'tan', opTraducida);
      opTraducida = deteccionFuncion('seno inverso', 'arcsin', opTraducida);
      opTraducida = deteccionFuncion('seno', 'sin', opTraducida);
      let deletedWords = opTraducida.match(
        /(\d)|[-%.x+/^√π()]|(lg|ln|cos|arccos|tan|acctan|sin|arcsin)/g,
      );
      opTraducida = deletedWords.join('');
    } catch (e) {
      console.error(e);
    }
    return opTraducida;
  };

  const deteccionFuncion = (palabra, operador, opTraducida) => {
    while (opTraducida.includes(palabra)) {
      let split = opTraducida.split(
        /(?<=[\d.])(?=[^\d.])|(?<=[^\d.])(?=[\d.])|(?<=[-+x/])(?=[^-+x/])|(?<=[^-+x/])(?=[-+x/])|(π|pi)/,
      );
      let number = '0';
      let posLog = -1;
      console.log(split);
      for (let x = 0; x < split.length; x++) {
        if (split[x].includes(palabra)) {
          posLog = x;
          if (split[x + 1].includes('-')) {
            number = '-' + split[x + 2];
            opTraducida = opTraducida.replace(
              split[posLog] + split[posLog + 1] + split[posLog + 2],
              operador + '(' + number + ')',
            );
          } else {
            number = split[x + 1];
            opTraducida = opTraducida.replace(
              split[posLog] + split[posLog + 1],
              operador + '(' + number + ')',
            );
          }
        }
      }
    }
    return opTraducida;
  };

  const contieneOperadores = op => {
    let funciones = [
      'arctan(',
      'arcsin(',
      'arccos(',
      'tan(',
      'sin(',
      'cos(',
      'lg(',
      'ln(',
    ];
    let result = -1;
    for (let funcion of funciones) {
      if (op.includes(funcion)) {
        result = op.indexOf(funcion);
        break;
      }
    }
    return result;
  };
}
