import React from 'react';
import {View} from 'react-native';
import DuoOne from 'duo/DuoOne';
// import {BaseDRNService} from '@traveloka/district-fetcher';
import axios from 'axios';

export default function Red() {
  const [y, setY] = React.useState(1);

  // const mService = new BaseDRNService(null);
  axios
    .get('https://www.google.com')
    .then(() => {
      // console.warn('x');
    })
    .catch((e) => {
      // console.warn('err');
    });

  return (
    <>
      <View style={{height: 50, backgroundColor: 'green'}} />
      <DuoOne />
    </>
  );
}
