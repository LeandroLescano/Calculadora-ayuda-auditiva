import MathSolver from '../functions/MathSolver';

const MS = new MathSolver();

test('(-1/4)*(-7/10) = 0.175', () => {
  // var stack = MS.resolveRPN(['1', '4', '/', '-', '7', '10', '/', '-', '*']);
  expect(resolveOperation('(-1/4)*(-7/10)')).toBe(0.175);
});

test('(-1/4)*(-7/(-10)) = -0.175', () => {
  // var stack = MS.resolveRPN([
  //   '1',
  //   '4',
  //   '/',
  //   '-',
  //   '7',
  //   '10',
  //   '-',
  //   '/',
  //   '-',
  //   '*',
  // ]);
  expect(resolveOperation('(-1/4)*(-7/(-10))')).toBe(-0.175);
});

test('lg(10)/ln(4)-9^2+322-500 = -258.2786524795555', () => {
  // var stack = MS.resolveRPN([
  //   '10',
  //   'lg',
  //   '4',
  //   'ln',
  //   '/',
  //   '9',
  //   '2',
  //   '^',
  //   '-',
  //   '322',
  //   '+',
  //   '500',
  //   '-',
  // ]);
  expect(resolveOperation('lg(10)/ln(4)-9^2+322-500')).toBe(-258.2786524795555);
});

test('lg(10)/ln(4) = 0.7213475204444817', () => {
  // var stack = MS.resolveRPN(['10', 'lg', '4', 'ln', '/']);
  expect(resolveOperation('lg(10)/ln(4)')).toBe(0.7213475204444817);
});

test('8-sin(8) = 7.01064175338', () => {
  // var stack = MS.resolveRPN(['8', '8', 'sin', '-']);
  expect(resolveOperation('8-sin(8)')).toBe(7.0106417533766185);
});

test('6+5 = 11', () => {
  expect(resolveOperation('6+5')).toBe(11);
});

test('-6+5 = -1', () => {
  expect(resolveOperation('-6+5')).toBe(-1);
});

test('6-5 = 1', () => {
  expect(resolveOperation('6-5')).toBe(1);
});

test('6+6-(7+4)-(4/2) = -1', () => {
  // var stack = MS.resolveRPN([
  //   '6',
  //   '6',
  //   '+',
  //   '7',
  //   '4',
  //   '+',
  //   '-',
  //   '4',
  //   '2',
  //   '/',
  //   '-',
  // ]);
  expect(resolveOperation('6+6-(7+4)-(4/2)')).toBe(-1);
});

const resolveOperation = input => {
  let operationBasic = MS.resolveAdvanced(input);
  var resultOp = MS.infixToPostfix(operationBasic.replace(/x/g, '*')).split(
    ' ',
  );
  return MS.resolveRPN(resultOp)[0];
};
