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
    console.log(textChecked);
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
    if (textChecked.includes('-')) {
      textChecked = textChecked.replace('-', ' menos ');
    }
    if (textChecked.includes('+')) {
      textChecked = textChecked.replace('+', ' más ');
    }
    if (textChecked.includes('^')) {
      textChecked = textChecked.replace('^', ' elevado a la ');
    }
    if (textChecked.includes('ln(')) {
      textChecked = textChecked.replace('ln', ' logaritmo natural de ');
    }
    if (textChecked.includes('lg(')) {
      textChecked = textChecked.replace('lg', ' logaritmo decimal de ');
    }
    if (textChecked.includes('arccos(')) {
      textChecked = textChecked.replace('arccos', ' coseno inverso de ');
    } else if (textChecked.includes('cos(')) {
      textChecked = textChecked.replace('cos', ' coseno de ');
    }
    if (textChecked.includes('arctan(')) {
      textChecked = textChecked.replace('arctan', ' tangente inversa de ');
    } else if (textChecked.includes('tan(')) {
      textChecked = textChecked.replace('tan', ' tangente de ');
    }
    if (textChecked.includes('arcsin(')) {
      textChecked = textChecked.replace('arcsin', ' seno inverso de ');
    } else if (textChecked.includes('sin(')) {
      textChecked = textChecked.replace('sin', ' seno de ');
    }
    if (textChecked.includes('√')) {
      textChecked = textChecked.replace('√', ' raiz cuadrada de ');
    }
    return textChecked;
  };
}
