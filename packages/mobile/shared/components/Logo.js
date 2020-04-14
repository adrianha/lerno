import React from 'react';
import {Image, Text} from 'react-native';
import EN from '../translations/en.json';

export default function Logo() {
  return (
    <>
      <Image
        source={require('../images/traveloka.png')}
        style={{width: 200, height: 75, resizeMode: 'contain'}}
      />
      <Text>{EN.hello_world}</Text>
    </>
  );
}
