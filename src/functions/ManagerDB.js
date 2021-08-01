import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManagerDB() {
  this.getConfig = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('configuration');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  this.getHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('history');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  this.saveOperation = async (resultSave, history, operation) => {
    let localHistory = history ?? {list: []};
    let repeat = false;
    console.log({history}, {localHistory});
    localHistory.list.map(op => {
      if (op.operation === operation && op.result === resultSave) {
        repeat = true;
        return;
      }
    });
    if (!repeat && !isNaN(resultSave)) {
      try {
        if (localHistory.list === undefined) {
          localHistory = {list: [{operation: operation, result: resultSave}]};
        } else {
          if (Object.keys(localHistory.list).length === 10) {
            localHistory.list.pop();
          }
          localHistory.list.unshift({operation: operation, result: resultSave});
        }
        await AsyncStorage.setItem('history', JSON.stringify(localHistory));
      } catch (e) {
        console.error(e);
      }
    }
  };
}
