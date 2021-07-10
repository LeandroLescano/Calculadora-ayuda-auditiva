export default function Recorder(Voice) {
  this.onSpeechStart = e => {
    console.log('onSpeechStart: ', e);
    // this.setState({
    //   started: '√',
    // });
  };

  this.onSpeechRecognized = e => {
    console.log('onSpeechRecognized: ', e);
    // this.setState({
    //   recognized: '√',
    // });
  };

  this.onSpeechEnd = e => {
    console.log('onSpeechEnd: ', e);
    // this.setState({
    //   end: '√',
    // });
  };

  // this.onSpeechError = e => {
  //   console.log('onSpeechError: ', e);
  //   // this.setState({
  //   //   error: JSON.stringify(e.error),
  //   // });
  // };

  //   this.onSpeechResults = e => {
  //     console.log('onSpeechResults: ', e);
  //     return e.value;
  //     // this.setState({
  //     //   results: e.value,
  //     // });
  //   };

  this.onSpeechPartialResults = e => {
    console.log('onSpeechPartialResults: ', e);
    // this.setState({
    //   partialResults: e.value,
    // });
  };

  this.onSpeechVolumeChanged = e => {
    console.log('onSpeechVolumeChanged: ', e);
    // this.setState({
    //   pitch: e.value,
    // });
  };

  //   this._startRecognizing = async () => {
  //     this.setState({
  //       recognized: '',
  //       pitch: '',
  //       error: '',
  //       started: '',
  //       results: [],
  //       partialResults: [],
  //       end: '',
  //     });

  //     try {
  //       await Voice.start('es-ES');
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  //   this._stopRecognizing = async () => {
  //     try {
  //       await Voice.stop();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   };

  this._cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  this._destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    // this.setState({
    //   recognized: '',
    //   pitch: '',
    //   error: '',
    //   started: '',
    //   results: [],
    //   partialResults: [],
    //   end: '',
    // });
  };
}
