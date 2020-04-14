import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
// import axios from 'axios';

class DuoOne extends Component {
  // componentDidMount() {
  //   axios
  //     .get('https://www.google.com')
  //     .then(() => {
  //       // console.warn('zzz');
  //     })
  //     .catch((e) => {
  //       // console.warn('errzzz');
  //     });
  // }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.spacing} />
          <Placeholder
            Animation={Fade}
            Left={PlaceholderMedia}
            Right={PlaceholderMedia}>
            <PlaceholderLine width={80} />
            <PlaceholderLine />
            <PlaceholderLine width={30} />
          </Placeholder>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 8,
    position: 'relative',
    marginTop: -8,
  },
  inner: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  spacing: {
    height: 8,
  },
});

export default DuoOne;
