import {useEffect} from 'react';
import Tts from 'react-native-tts';

export default function VoiceHelper() {
  useEffect(() => {
    Tts.getInitStatus().then(() => {
      Tts.setDefaultLanguage('es-US');
    });
  }, []);

  this.speak = text => {
    Tts.getInitStatus().then(() => {
      Tts.speak(this.checkText(text));
    });
  };

  this.checkText = text => {
    let textChecked = text;
    switch (textChecked) {
      case 'lft': {
        return 'izquierda';
      }
      case 'rgt': {
        return 'derecha';
      }
      case '+': {
        return 'más';
      }
      case '-': {
        return 'menos';
      }
      case 'x': {
        return 'por';
      }
      case '/': {
        return 'dividir';
      }
      case 'AC': {
        return 'Borrar todo';
      }
      case 'DEL': {
        return 'Borrar';
      }
      case '^': {
        return 'Elevado a la ';
      }
    }
    if (textChecked.includes('/')) {
      textChecked = textChecked.replace('/', ' dividido ');
    }
    if (textChecked.includes('+')) {
      textChecked = textChecked.replace('+', ' más ');
    }
    if (textChecked.includes('x')) {
      textChecked = textChecked.replace('x', ' por ');
    }
    if (textChecked.includes('X^')) {
      textChecked = textChecked.replace('X^', ' elevado a la ');
    }
    if (textChecked.match(/(Ln|ln\()/g)) {
      textChecked = textChecked.replace(/(Ln|ln\()/g, ' logaritmo natural de ');
    }
    if (textChecked.match(/(Lg|lg\()/g)) {
      textChecked = textChecked.replace(/(Lg|lg\()/g, ' logaritmo decimal de ');
    }
    if (textChecked.match(/(Cos-1|arccos\()/g)) {
      textChecked = textChecked.replace(
        /(Cos-1|arccos\()/g,
        ' coseno inverso de ',
      );
    } else if (textChecked.match(/(Cos|cos\()/g)) {
      textChecked = textChecked.replace(/(Cos|cos\()/g, ' coseno de ');
    }
    if (textChecked.match(/(Tan-1|arctan\()/g)) {
      textChecked = textChecked.replace(
        /(Tan-1|arctan\()/g,
        ' tangente inversa de ',
      );
    } else if (textChecked.match(/(Tan|tan\()/g)) {
      textChecked = textChecked.replace(/(Tan|tan\()/g, ' tangente de ');
    }
    if (textChecked.match(/(Sin-1|arcsin\()/g)) {
      textChecked = textChecked.replace(
        /(Sin-1|arcsin\()/g,
        ' seno inverso de ',
      );
    } else if (textChecked.match(/(Sin|sin\()/g)) {
      textChecked = textChecked.replace(/(Sin|sin\()/g, ' seno de ');
    }
    if (textChecked.includes('-')) {
      textChecked = textChecked.replace('-', ' menos ');
    }
    if (textChecked.includes('√')) {
      textChecked = textChecked.replace('√', ' raiz cuadrada de ');
    }
    return textChecked;
  };
}
