// import Voice from '@react-native-voice/voice';

export default function Recorder() {
  this.onSpeechStart = e => {
    // console.log('onSpeechStart: ', e);
  };

  this.onSpeechRecognized = e => {
    // console.log('onSpeechRecognized: ', e);
  };

  this.onSpeechEnd = e => {
    // console.log('onSpeechEnd: ', e);
  };

  this.onSpeechError = e => {
    console.log('onSpeechError: ', e);
  };

  this.onSpeechResults = e => {
    // console.log('onSpeechResults: ', e);
    return e.value;
  };

  this.onSpeechPartialResults = e => {
    // console.log('onSpeechPartialResults: ', e);
  };

  this.onSpeechVolumeChanged = e => {
    // console.log('onSpeechVolumeChanged: ', e);
  };

  // this._startRecognizing = async () => {
  //   try {
  //     await Voice.start('es-ES');
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // this._stopRecognizing = async () => {
  //   try {
  //     await Voice.stop();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // this._cancelRecognizing = async () => {
  //   try {
  //     await Voice.cancel();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  // this._destroyRecognizer = async () => {
  //   try {
  //     await Voice.destroy();
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
}
