import React from 'react';
import {View, Text} from 'react-native';
import {Picker} from '@react-native-picker/picker';

function PickerList(props) {
  const handleChange = value => {
    props.updateConfig(value);
  };

  return (
    <>
      <Text style={props.styles.title}>{props.title}</Text>
      <View style={props.styles.pickerContainer}>
        <Picker
          itemStyle={props.styles.picker}
          selectedValue={props.value}
          onValueChange={itemValue => handleChange(itemValue)}
          style={props.styles.picker}
          dropdownIconColor={'#1a1a1a'}
          prompt={props.title}>
          {props.data.map((op, i) => {
            return (
              <Picker.Item
                key={i}
                style={props.styles.pickerText}
                label={op.label ?? op.toString()}
                value={op.value ?? op}
              />
            );
          })}
        </Picker>
      </View>
    </>
  );
}

export default PickerList;
