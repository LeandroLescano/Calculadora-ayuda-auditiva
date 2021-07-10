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
}
